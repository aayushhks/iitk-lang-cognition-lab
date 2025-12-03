import os
import json
import hashlib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import uuid

# Configuration
DB_DIR = "./db"
USERS_FILE = os.path.join(DB_DIR, "users.json")
RESULTS_DIR = "./benchmark_results"

def get_word_complexity(word):
    """
    Proxy for 'Context': 
    - Short, common words -> 'Day-to-Day / Movies'
    - Long, complex words -> 'Research / Academic'
    
    (In a real deployment, use the 'wordfreq' library here)
    """
    length = len(word)
    if length <= 5:
        return "Casual (Movies/Daily)"
    elif length >= 9:
        return "Academic (Research)"
    else:
        return "General"

def load_human_data_with_metadata(dimension="Arousal", region_filter=None):
    """
    Loads human ratings but allows filtering by User Region (hailFrom).
    """
    print(f" Loading human data for '{dimension}' (Region: {region_filter or 'All'})...")
    
    if not os.path.exists(USERS_FILE):
        return None

    # Load User Metadata Map (Email Hash -> Region)
    user_meta = {}
    with open(USERS_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)
        for email, data in users.items():
            sha256 = hashlib.sha256()
            sha256.update(email.encode('utf-8'))
            email_hash = sha256.hexdigest()
            
            # Normalize region string
            region = data.get('hailFrom', 'Unknown').strip().title()
            user_meta[email_hash] = region

    # Collect ratings
    all_ratings = []
    
    for email_hash, region in user_meta.items():
        # Apply Region Filter
        if region_filter and region != region_filter:
            continue
            
        file_path = os.path.join(DB_DIR, email_hash)
        if not os.path.exists(file_path):
            continue
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                user_data = json.load(f)
                
            if dimension in user_data:
                course_data = user_data[dimension]
                for word, details in course_data.items():
                    if isinstance(details, list) and len(details) > 0:
                        rating = details[0]
                        if isinstance(rating, (int, float)) and rating != -10:
                            all_ratings.append({
                                'word': word, 
                                'rating': rating,
                                'context_type': get_word_complexity(word)
                            })
        except Exception:
            continue

    if not all_ratings:
        print(f" No data found for region: {region_filter}")
        return None

    return pd.DataFrame(all_ratings)

def get_llm_ratings_mock(word_list, dimension):
    # (Same simulation as before - imagine this is GPT-4)
    np.random.seed(42)
    return [np.random.randint(1, 8) for _ in word_list]

def analyze_cognitive_gap(df, title_suffix=""):
    """
    Calculates Gap (MAE) and Correlation.
    """
    # Group by word to get mean human rating
    df_agg = df.groupby(['word', 'context_type'])['rating'].mean().reset_index()
    df_agg.rename(columns={'rating': 'human_rating'}, inplace=True)
    
    # Get AI Ratings
    df_agg['ai_rating'] = get_llm_ratings_mock(df_agg['word'].tolist(), "dimension") # dimension placeholder
    
    # Calculate Metrics
    correlation = df_agg['human_rating'].corr(df_agg['ai_rating'])
    mae = np.mean(np.abs(df_agg['human_rating'] - df_agg['ai_rating']))
    
    print(f"   >> {title_suffix.ljust(20)} | Corr: {correlation:.3f} | Gap (MAE): {mae:.3f}")
    return df_agg

def run_advanced_benchmark(dimension="Arousal"):
    print(f"\n Starting Advanced Cognitive Benchmark for '{dimension}'...\n")
    os.makedirs(RESULTS_DIR, exist_ok=True)

    # 1. Global Baseline
    df_all = load_human_data_with_metadata(dimension)
    if df_all is None: return
    print("--- Baseline Analysis ---")
    analyze_cognitive_gap(df_all, "Global Population")

    # 2. Contextual Analysis (Movies vs Research)
    print("\n--- Contextual/Genre Analysis ---")
    print("Does AI understand 'Academic' words better than 'Casual' words?")
    
    df_casual = df_all[df_all['context_type'] == "Casual (Movies/Daily)"]
    df_academic = df_all[df_all['context_type'] == "Academic (Research)"]
    
    if not df_casual.empty:
        analyze_cognitive_gap(df_casual, "Casual/Movies")
    if not df_academic.empty:
        analyze_cognitive_gap(df_academic, "Academic/Research")

    # 3. Regional Analysis (Bias Detection)
    # Get top 3 regions dynamically
    top_regions = df_all['rating'].groupby(load_human_data_with_metadata(dimension, None).index).count() 
    # (Simplified region fetching logic for demo script)
    # In real app, we'd query distinct regions first. 
    # Let's simulate checking specific regions we care about:
    target_regions = ["Delhi", "Mumbai", "Bangalore", "Rural"]
    
    print("\n--- Geo-Linguistic Bias Analysis ---")
    print("Does AI align better with certain regions?")
    
    region_results = []
    for region in target_regions:
        df_region = load_human_data_with_metadata(dimension, region_filter=region)
        if df_region is not None:
            agg = analyze_cognitive_gap(df_region, region)
            # Store MAE for plotting
            mae = np.mean(np.abs(agg['human_rating'] - agg['ai_rating']))
            region_results.append({'region': region, 'gap': mae})

    # 4. Generate Insight Plot (Regional Gap)
    if region_results:
        rdf = pd.DataFrame(region_results)
        plt.figure(figsize=(8, 5))
        bars = plt.bar(rdf['region'], rdf['gap'], color=['#ff9999', '#66b3ff', '#99ff99'])
        plt.title(f"AI Cognitive Bias by Region ({dimension})")
        plt.ylabel("Cognitive Gap (Lower is Better)")
        plt.xlabel("User Region")
        plt.ylim(0, max(rdf['gap']) + 1)
        
        output_file = os.path.join(RESULTS_DIR, f"regional_bias_{dimension}.png")
        plt.savefig(output_file)
        print(f"\n Regional Bias Plot saved to: {output_file}")

if __name__ == "__main__":
    run_advanced_benchmark(dimension="Arousal")
