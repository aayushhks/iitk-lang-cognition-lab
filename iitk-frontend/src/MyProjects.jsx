import Footer from './Footer.jsx';
import Navbar from './navbar.js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProjects.css';
import { ip } from './config'

function MyProjects() {
    const navigate = useNavigate();
    const bannerImageUrl = "https://www.cgs.iitk.ac.in/img0/ESB2.jpg?23"
    const img1Url = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 512 512'%3E%3Cpath d='M256 48c28.087 0 55.325 5.497 80.958 16.339 24.767 10.476 47.013 25.476 66.12 44.583s34.107 41.354 44.583 66.12C458.503 200.675 464 227.913 464 256s-5.497 55.325-16.339 80.958c-10.476 24.767-25.476 47.013-44.583 66.12s-41.354 34.107-66.12 44.583C311.325 458.503 284.087 464 256 464s-55.325-5.497-80.958-16.339c-24.767-10.476-47.013-25.476-66.12-44.583s-34.107-41.354-44.583-66.12C53.497 311.325 48 284.087 48 256s5.497-55.325 16.339-80.958c10.476-24.767 25.476-47.013 44.583-66.12s41.354-34.107 66.12-44.583C200.675 53.497 227.913 48 256 48m0-16C132.288 32 32 132.288 32 256s100.288 224 224 224 224-100.288 224-224S379.712 32 256 32z' fill='%23000'/%3E%3Cpath d='M107.776 320c-25.252 0-41.168-18.448-41.902-19.317a7.906 7.906 0 0 1 .982-11.192c3.374-2.813 8.401-2.388 11.248.948.604.701 14.606 16.597 35.606 13.186 12.104-1.964 28.08-25.681 38.652-41.376 4.251-6.311 7.922-11.761 11.215-15.856 16.773-20.865 33.899-23.333 45.325-21.726 24.139 3.394 44.358 27.498 53.689 49.882 7.454 17.884 19.042 28.256 32.628 29.208 15.408 1.061 31.539-9.885 43.105-29.336 1.228-2.064 2.562-4.496 3.978-7.07 9.482-17.262 23.814-43.35 51.75-43.35 31.146 0 51.957 34.286 52.828 35.746 2.252 3.774.996 8.648-2.806 10.885-3.8 2.237-8.708.988-10.96-2.786-.037-.062-4.493-7.413-11.859-14.568-6.286-6.107-16.108-13.387-27.203-13.387-18.438 0-29.121 19.445-37.705 35.07-1.48 2.696-2.88 5.243-4.245 7.538-14.718 24.751-36.4 38.635-58.01 37.108-19.951-1.398-36.389-15.242-46.284-38.98-10.013-24.02-28.279-38.417-41.149-40.228-10.6-1.494-20.895 3.861-30.578 15.906-2.872 3.573-6.539 9.017-10.421 14.779-13.549 20.114-30.411 45.146-49.37 48.223a53.122 53.122 0 0 1-8.514.693z' fill='%23000'/%3E%3C/svg%3E";

    const [cardTitles, setCardTitles] = useState([]);
    const [cardDescs, setCardDescs] = useState([]);
    const [totalBlocks, setTotalBlocks] = useState([]);

    let userInfo = null;
    let name = null;
    let email = null;

    const getCardsInfo = async (chunkSize) => {
        userInfo = JSON.parse(localStorage.userinfo); // save localstorage userinfo
        name = userInfo.name;
        email = localStorage.getItem('email');
        try {
            const response = await fetch(`${ip[0]}/get-reg-courses`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify([email, chunkSize]),
            });

            const result = await response.json();

            setCardTitles(result[0]);
            setCardDescs(result[1]);
            setTotalBlocks(result[2]);

            // console.log("cardTitles", result);
        } catch (error) {
            console.log('An error occurred');
        }
    }

    const viewCourse = (event) => {
        const courseName = event.target.parentNode.querySelector('h5').textContent;
        localStorage.setItem('courseName', courseName);
        navigate('/course');
    }

    useEffect(() => {
        if (localStorage.length === 0 || JSON.parse(localStorage.userinfo)['isadmin']) {
            navigate('/login')
        } else {
            getCardsInfo(4);
        }
    }, [cardTitles]);

    return (
        <div className="homepage">
            <Navbar />
            <div className="hidden-div-my-projects"></div>
            <div className="greeting-my-projects">
                Hi, {JSON.parse(localStorage.userinfo).name}
            </div>

            <div className="banner-area">
                <img src={bannerImageUrl} alt="Nature" class="responsive" />
            </div>

            {/* <div className="tags-area"> */}
            {/* {console.log("titles", cardTitles)}
            {console.log("desc", cardDescs)} */}

        <div className="tags-area">
            {/* {console.log(cardTitles)} */}
        {
            cardTitles.map((v, index_i) => (
                <div className="tags">
                    {v.map((value, index_j) => (
                        <div className="card reg-card-my-course">
                        <img className="card-img-top card-img-custom" src={img1Url} alt="Card image cap" />
                        <div className="card-body card-body-css-my-projects">
                            {/* {console.log(JSON.stringify(value))} */}
                            <h5 className="card-title card-title-heading">{Object.keys(value)[0]}</h5>
                            <p className="card-text card-p-text">{cardDescs[index_i][index_j]}</p>
                            {/* {console.log(Object.keys(Object.values(value)[0]))} */}
                            <div className="tags2">
                                {
                                    Object.values(value)[0]['tags'].map((tag, index) => (
                                        <div key={index} className="tag">
                                            {tag}
                                        </div>
                                    ))
                                }
                            </div>

                            <p className="project-info-title-my-projects">Blocks Completed: {Object.values(value)[0]['blocksCompleted']}</p>
                            <p className="project-info-title-my-projects">Total Blocks: {totalBlocks}</p>
                            <p className="project-info-title-my-projects credits-text">Credits: {(Object.values(value)[0]['blocksCompleted']/10)}</p>

                            <button
                                onClick={(event) => viewCourse(event)}
                                className="btn btn-outline-primary btn-bootstrap view-btn-my-projects">
                                    View
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            ))
        }
        </div>
    <Footer />
</div>
)
}

export default MyProjects;
