import bcrypt

# Function to hash a password
def hash_password(password: str) -> str:
    # Convert the password to bytes
    password_bytes = password.encode('utf-8')
    
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()  # Automatically generates a salt
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    
    return hashed_password.decode('utf-8')  # Convert bytes back to string for storage

# Function to verify a password
def verify_password(password: str, hashed_password: str) -> bool:
    # Convert both password and hashed password to bytes
    password_bytes = password.encode('utf-8')
    hashed_password_bytes = hashed_password.encode('utf-8')

    # Compare the provided password with the stored hashed password
    return bcrypt.checkpw(password_bytes, hashed_password_bytes)
