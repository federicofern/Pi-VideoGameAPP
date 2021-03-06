import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postVideogame, getGenres, getPlatforms } from "../../actions";
import style from './index.module.css'

/* errores dentro del form */
const validate = (input) => {
    let errors = {};
    if (input.name === "") {
        errors.name = "Name incomplete.";
    } else if (!/^[A-Z]+[A-Za-z0-9\s]+$/g.test(input.name)) {
        errors.name = 'Insert first letter in uppercase'
    }

    if (input.name.length > 255) {
        errors.name = 'Must be less then 255 characters'
    }

    if (input.background_image === "") {
        errors.background_image = "What image does it have?";
    }

    if (!input.description) {
        errors.description = "Description incomplete.";
    }

    if (input.rating > 5 || input.rating < 0) {
        errors.rating = "Rating must be between 0 and 5";
    }

    if (!input.released) {
        errors.released = "When was it released?";
    }

    if (input.platforms.length === 0) {
        errors.platforms = "Choose a platform to continue";
    }

    if (input.genres.length === 0) {
        errors.genres = "Choose a genre to continue";
    }

    return errors;
};

/* ---------------------------- */


export default function VideogameCreate() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const genre = useSelector((state) => state.genres)
    const platforms = useSelector((state) => state.platforms)

    const [input, setInput] = useState({
        name: '',
        background_image: '',
        description: '',
        platforms: [],
        rating: 0,
        released: '',
        genres: []
    })

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getGenres())
    }, [])

    useEffect(() => {
        dispatch(getPlatforms())
    }, [])

    useEffect(() => {
        setErrors(validate(input))
    }, [])

    /* Funciones onClick/onChange */

    const handleChange = (e) => {
        e.preventDefault();
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
        setErrors(
            validate({
                ...input,
                [e.target.name]: e.target.value,
            })
        );
    }

    const handleSelectP = (e) => {
        e.preventDefault();
        setInput({
            ...input,
            platforms: [...input.platforms, e.target.value]
        })
        setErrors(
            validate({
                ...input,
                platforms: [...input.platforms, e.target.value],
            })
        );
    }

    const handleDeleteP = (e) => {
        setInput({
            ...input,
            platforms: input.platforms.filter(d => d !== e)
        })
    }

    const handleSelectG = (e) => {
        e.preventDefault();
        setInput({
            ...input,
            genres: [...input.genres, e.target.value]
        })
        setErrors(
            validate({
                ...input,
                genres: [...input.genres, e.target.value],
            })
        );
    }

    const handleDeleteG = (e) => {
        setInput({
            ...input,
            genres: input.genres.filter(d => d !== e)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) {
            alert("Complete the required fields!");
        } else {
            dispatch(postVideogame(input))
            alert("You've a New Video Game!")
            setInput({
                name: '',
                background_image: '',
                description: '',
                platforms: [],
                rating: 0,
                released: '',
                genres: []
            })
            navigate("/home");
            window.location.reload()
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        let res = window.confirm('Are you sure you want to leave?')
        if (res) {
            navigate("/home");
        } else {
            return false
        }
    }

    return (
        <div className={style.fondo}>
            <div className={style.form}>
                <h1>NEW VIDEOGAME</h1>
                <form onSubmit={handleSubmit}>
                    <div className={style.bigbigbox}>
                        <div className={style.bigbox}>
                            <div className={style.box1}>
                                <div>
                                    <label>Name: </label>
                                    <input type='text' placeholder="What is it called?" value={input.name} name='name' onChange={handleChange}></input>
                                    {errors.name ? <p className={style.error}> {errors.name} </p> : <p className={style.espacio}></p>}
                                </div>
                                <div>
                                    <label>Rating: </label>
                                    <input type='number' placeholder='1,00' value={input.rating} name='rating' onChange={handleChange} step="0.01" min="0" max="5"></input>
                                    {errors.rating ? <p className={style.error}> {errors.rating} </p> : <p className={style.espacio}></p>}
                                </div>
                            </div>
                            <div className={style.box2}>
                                <div>
                                    <label>Released: </label>
                                    <input type='date' placeholder='when was it released?' value={input.released} name='released' onChange={handleChange}></input>
                                    {errors.released ? <p className={style.error}> {errors.released} </p> : <p className={style.espacio}></p>}
                                </div>
                                <div>
                                    <label>Image: </label>
                                    <input type='text' placeholder="Put the URL of the image" value={input.background_image} name='background_image' onChange={handleChange}></input>
                                    {errors.background_image ? (<p className={style.error}> {errors.background_image} </p>) : <p className={style.espacio}></p>}
                                </div>
                            </div>
                        </div>

                        <div className={style.description}>
                            <label>Description: </label>
                            <textarea rows="5" cols="40" value={input.description} name='description' onChange={handleChange} placeholder="What is it about?"></textarea>
                            {errors.description ? (<p className={style.error}> {errors.description} </p>) : <p className={style.space}></p>}
                        </div>
                    </div>
                    <div className={style.platgen}>
                        <div >
                            <label>Platforms: </label>
                            <select onChange={handleSelectP} name='platforms' key={'plat'}>
                                {platforms.map((p) => (
                                    <option value={p} key={p}>{p}</option>
                                ))}
                            </select>
                            <ul>{!input.platforms.length ? <p className={style.error}>Select Platforms</p>
                                : input.platforms.map(e => <li onClick={() => handleDeleteP(e)} key={e}>{e}</li>)}</ul>
                        </div>

                        <div>
                            <label>Genres: </label>
                            <select onChange={handleSelectG} name='genres' key={'gen'}>
                                {genre.map((g) => (
                                    <option value={g.name} key={g}>{g.name}</option>
                                ))}
                            </select>
                            <ul>{!input.genres.length ? <p className={style.error}>Select Genres</p> : input.genres.map(e => <li onClick={() => handleDeleteG(e)} key={e}>{e}</li>)}</ul>
                        </div>
                    </div>
                    <div className={style.button}>
                        <button type="submit">Create</button>
                        <button type='button' onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
