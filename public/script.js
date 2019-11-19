"use strict";

const mainContainer = document.querySelector(".root");

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.token = options.headers.autorization;
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: {
        authorization: this.token
      }
    })
    .then(res => getResponseJson(res));
  }

  getMyInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: {
        authorization: this.token
      }
    })
    .then(res => getResponseJson(res));
  }

  patchMyInfo(name, about) {
    const button = document.querySelector('.popup__button');
    button.textContent = "Загрузка...";
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(getResponseJson(res));
  }

  postNewCard(name, link) {
    const button = document.querySelector('.popup__button');
    button.classList.add("save-name");
    button.textContent = "Загрузка...";
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then(res => getResponseJson(res));
  }

  deleteCard(id) {
    return fetch(`${this.baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: this.token
      }
    })
    .then(res => getResponseJson(res));
  }

  putLike(id) {
    return fetch(`${this.baseUrl}/cards/like/${id}`, {
      method: 'PUT',
      headers: {
        authorization: this.token
      }
    })
    .then(res => getResponseJson(res));
  }

  deleteLike(id) {
    return fetch(`${this.baseUrl}/cards/like/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: this.token
      }
    })
    .then(res => getResponseJson(res));
  }

  editAvatar(link) {
    const button = document.querySelector('.popup__button');
    button.classList.add("save-avatar");
    button.textContent = "Загрузка...";
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(res => getResponseJson(res));
  }
}

const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort2',
  headers: {
    autorization: 'ae41ed05-5a47-4c64-a403-eff72ecadc29',
    'Content-Type': 'application/json'
  }
})

let placesList; 
api.getInitialCards()
  .then(res => {    
    placesList = new CardList(document.querySelector(".places-list"), res);
    placesList.render();
  })
  .catch((err) => {
    console.error('Что-то пошло не так: ' + err);
  });

api.getMyInfo()
  .then(res => {
    document.querySelector(".user-info__photo")
      .setAttribute("style", `background-image: url(${res.avatar})`);
    const userName = document.querySelector(".user-info__name");
    const userJob = document.querySelector(".user-info__job");
    userName.textContent = res.name;
    userJob.textContent = res.about;
  })
  .catch(() => {
    console.error('Что-то пошло не так');
  });

class Card {
  constructor(name, link, id, owner, likes) {
    this.popupImageContainer = createElementWithClass(
      "div",
      "popup-image-container"
    );
    this.popupImageContent = createElementWithClass(
      "div",
      "popup-image__content"
    );
    this.popupImageImg = createElementWithClass("img", "popup-image__img");
    this.popupImageCloseButton = createElementWithClass("img", "popup__close");
    this.popupImageCloseButton.src = "./images/close.svg";
    this.cardElement = this.create(name, link, id, owner, likes);
    this.cardElement
      .querySelector(".place-card__like-icon")
      .addEventListener("click", this.like);
    this.cardElement
      .querySelector(".place-card__image")
      .addEventListener("click", this.makeBigger.bind(this));

    this.popupImageCloseButton.addEventListener(
      "click",
      this.closeBiggerImage.bind(this)
    );
  }
  makeBigger(event) {
    if (!event.target.classList.contains("place-card__delete-icon")) {
      mainContainer.appendChild(this.popupImageContainer);
      this.popupImageContainer.appendChild(this.popupImageContent);
      this.popupImageContent.appendChild(this.popupImageCloseButton);
      this.popupImageContent.appendChild(this.popupImageImg);
      this.popupImageImg.src = event.target.getAttribute("link");
      this.popupImageContainer.classList.add("popup-image-container_is-opened");
    }
  }
  closeBiggerImage() {
    this.popupImageContainer.classList.remove(
      "popup-image-container_is-opened"
    );
  }
  like(event) {
    const id = event.target.parentElement.parentElement.id;
    if (event.target.classList.contains("place-card__like-icon_liked")) {
      api.deleteLike(id)
      .then(res => {
        updateLikesCount(id, res);
        event.target.classList.remove("place-card__like-icon_liked");
      })
      .catch(() => {
        console.error("Проблемы с лайками");
      });
    } else {
      api.putLike(id)
      .then(res => {
        updateLikesCount(id, res);
        event.target.classList.add("place-card__like-icon_liked");
      })
      .catch(() => {
        console.error("Проблемы с лайками");
      });
    }
  }
  remove(event) {
    const cardForDelete = event.target.parentElement.parentElement;
    const id = cardForDelete.id;
    api.deleteCard(id);
    cardForDelete.remove();
  }
  create(name, link, id, owner, likes) {
    const placeCard = createElementWithClass("div", "place-card");
    placeCard.setAttribute("id", id);
    const cardImage = createElementWithClass("div", "place-card__image");
    const cardDescription = createElementWithClass(
      "div",
      "place-card__description"
    );
    const cardName = createElementWithClass("h3", "place-card__name");
    const likeButton = createElementWithClass(
      "button",
      "place-card__like-icon"
    );
    
    placeCard.appendChild(cardImage);
    placeCard.appendChild(cardDescription);
    cardDescription.appendChild(cardName);
    cardDescription.appendChild(likeButton);
    
    const likesCounter = createElementWithClass("p", "place-card__likes-counter");
    likesCounter.textContent = likes.length;
    cardDescription.appendChild(likesCounter);

    //проверяем есть ли лайк от нашего id, чтобы окрасить кнопку
    const isLiked = likes.some(function(item) {
      if (item._id === 'e12323464360dff3a613fd4b') {
        return true;
      } else {
        return false;
      }
    }, 0);

    if (isLiked) {
      likeButton.classList.add("place-card__like-icon_liked");
    }
    
    //добавляем кнопку удаления, только если наш owner id
    if (owner === 'e12323464360dff3a613fd4b') {
      const deleteCardButton = createElementWithClass(
        "button",
        "place-card__delete-icon"
      );
      cardImage.appendChild(deleteCardButton);
      deleteCardButton.addEventListener("click", this.remove);
    }
    
    cardImage.setAttribute("style", `background-image: url(${link});`);
    cardImage.setAttribute("link", `${link}`);
    cardName.innerText = name;

    return placeCard;
  }
}

class CardList {
  constructor(container, cards) {
    this.container = container;
    this.data = cards;
  }
  addCard(name, link, id, owner, likes) {
    const newElement = new Card(name, link, id, owner, likes);
    this.container.appendChild(newElement.cardElement);
  }
  render() {
    this.data.forEach(item => {
      this.addCard(item.name, item.link, item._id, item.owner._id, item.likes);
    });
  }
}

class Popup {
  constructor(container) {
    this.container = container;
    this.placeOpenButton = document.querySelector(".popup__open");
    this.profileOpenButton = document.querySelector(".user-info__edit-button");
    this.closeButton = document.querySelector(".popup__close");
    this.firstField = this.container.querySelector(".popup__input_firstField");
    this.secondField = this.container.querySelector(".popup__input_secondField");
    this.submitButton = this.container.querySelector(".popup__button");
    this.popupTitle = this.container.querySelector(".popup__title");
    this.profileJob = document.querySelector(".user-info__job");
    this.userName = document.querySelector(".user-info__name");
    this.userJob = document.querySelector(".user-info__job");
    this.errorFirst = container.querySelector(".error_first");
    this.errorSecond = container.querySelector(".error_second");
    this.avatar = document.querySelector(".user-info__photo");

    this.placeOpenButton.addEventListener("click", this.open.bind(this));
    this.profileOpenButton.addEventListener("click", this.open.bind(this));
    this.avatar.addEventListener("click", this.open.bind(this));
    this.closeButton.addEventListener("click", this.close.bind(this));
    this.submitButton.addEventListener("click", this.submitHandler.bind(this));
    this.firstField.addEventListener("input", this.validate.bind(this));
    this.secondField.addEventListener("input", this.validate.bind(this));
  }

  open(event) {
    if (event.target.classList.contains("popup__open")) {
      this.makePlaceForm();
    } else if (event.target.classList.contains("user-info__edit-button")){
      this.makeProfileForm();
    } else {
      this.makeAvatarForm();
    }
    this.check();
    this.container.classList.add("popup_is-opened");
  }
  close() {
    this.container.classList.remove("popup_is-opened");
    this.clearForm.call(this);
  }
  submitHandler(event) {
    if (event.target.classList.contains("save-name")) {
      this.editProfile();
    } else if (event.target.classList.contains("save-avatar")) {
      this.changeAvatar();
    } else if (event.target.classList.contains("save-place")) {
      this.addCard();
    } else {
      console.error("Сломался вызов обработчика в форме");
    }
  }
  changeAvatar() {
    api.editAvatar(this.secondField.value)
    .then((res) => {
      this.avatar.setAttribute("style", `background-image: url(${res.avatar})`);
      this.close();
    })
    .catch(() => {
      console.error("Что-то не так с аватаром");
    });
  }
  editProfile() {
    api.patchMyInfo(this.firstField.value, this.secondField.value)
    .then(() => {
      api.getMyInfo()
      .then(res => {
        const userName = document.querySelector(".user-info__name");
        const userJob = document.querySelector(".user-info__job");
        userName.textContent = res.name;
        userJob.textContent = res.about;
      })
      .catch(() => {
        console.error('Что-то пошло не так');
      });
      popup.close();
    })
    .catch(() => {
      console.error('Что-то пошло не так');
    })
  }
  addCard() {
    api.postNewCard(this.firstField.value, this.secondField.value)
      .then((res) => {
        placesList.addCard(res.name, res.link, res._id, res.owner._id, res.likes);
        popup.close();
      })
      .catch((err) => {
        console.error(`Что-то пошло не так c добавлением карты: ${err}`);
      });
  }
  makePlaceForm() {
    this.container.classList.add("popup-place");
    this.popupTitle.textContent = "Новое место";
    this.firstField.setAttribute("style", "display: block");
    this.firstField.value = "";
    this.secondField.value = "";
    this.firstField.placeholder = "Название";
    this.secondField.placeholder = "Ссылка на картинку";
    this.submitButton.textContent = "+";
    this.submitButton.classList.add("save-place");
    this.submitButton.classList.remove("save-name");
    this.submitButton.classList.remove("save-avatar");
  }
  makeProfileForm() {
    this.container.classList.add("popup-profile");
    this.popupTitle.textContent = "Редактирование профиля";
    this.firstField.setAttribute("style", "display: block");
    this.firstField.value = this.userName.textContent;
    this.secondField.value = this.profileJob.textContent;
    this.firstField.placeholder = "Имя";
    this.secondField.placeholder = "Работа";
    this.submitButton.textContent = "Сохранить";
    this.submitButton.classList.add("save-name");
    this.submitButton.classList.remove("save-avatar");
    this.submitButton.classList.remove("save-place");
  }
  makeAvatarForm() {
    this.container.classList.add("popup-avatar");
    this.popupTitle.textContent = "Обновить аватар";
    this.secondField.value = "";
    this.secondField.placeholder = "Ссылка на картинку";
    this.firstField.value = "непустое значение, чтобы проверка заполненности отработала";
    this.firstField.setAttribute("style", "display: none");
    this.submitButton.textContent = "Сохранить";
    this.submitButton.classList.add("save-avatar");
    this.submitButton.classList.remove("save-name");
    this.submitButton.classList.remove("save-place");
  }
  validate(event) {
    if (event.target.classList.contains("popup__input_firstField")) {
      if (this.firstField.value.length === 0) {
        this.errorFirst.textContent = "Это обязательное поле";
      } else if (
        this.firstField.value.length < 2 ||
        this.firstField.value.length > 30
      ) {
        this.errorFirst.textContent = "Должно быть от 2 до 30 символов";
      } else {
        this.errorFirst.textContent = "";
      }
    } else {
      if (this.container.classList.contains("popup-profile")) {
        this.secondField.type = "text";
        if (this.secondField.value.length === 0) {
          this.errorSecond.textContent = "Это обязательное поле";
        } else if (
          this.secondField.value.length < 2 ||
          this.secondField.value.length > 30
        ) {
          this.errorSecond.textContent = "Должно быть от 2 до 30 символов";
        } else {
          this.errorSecond.textContent = "";
        }
      } else {
        this.secondField.type = "url";
        if (this.secondField.value.length === 0) {
          this.errorSecond.textContent = "Это обязательное поле";
        } else if (!this.secondField.checkValidity()) {
          this.errorSecond.textContent = "Здесь должна быть ссылка";
        } else {
          this.errorSecond.textContent = "";
        }
      }
    }
    this.check();
  }
  check() {
    if (
      this.errorFirst.textContent === "" &&
      this.errorSecond.textContent === "" &&
      this.firstField.value.length > 0 &&
      this.secondField.value.length > 0
    ) {
      this.submitButton.classList.add("popup__button_activ");
      this.submitButton.disabled = false;
    } else {
      this.submitButton.classList.remove("popup__button_activ");
      this.submitButton.disabled = true;
    }
  }
  clearForm() {
    this.clearErrors.call(this);
    this.clearFields.call(this);
    this.check.call(this);
    this.container.classList.remove("popup-place");
    this.container.classList.remove("popup-profile");
  }
  clearErrors() {
    this.errorFirst.textContent = "";
    this.errorSecond.textContent = "";
  }
  clearFields() {
    this.firstField.value = "";
    this.secondField.value = "";
  }
}

const popup = new Popup(document.querySelector(".popup"));


/*
  Очень хорошо, в классе Api теперь только работа с сервером и   
  реализован весь функционал предложенный в задании, отличная работа!

*/