'use strict';

function createElementWithClass(tagName, className) {
    let element = document.createElement(tagName);
    element.classList.add(className);
    return element;
}

function updateLikesCount(id, res) {
    const likesCounter = document.getElementById(id).querySelector(".place-card__likes-counter");
    likesCounter.textContent = res.likes.length;
}

function getResponseJson(res) {
    if (res.ok) {
        return res.json();
    } 
    return Promise.reject('Что-то пошло не так');
}