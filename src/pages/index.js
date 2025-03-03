import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

//Edit profile elements

const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModal = document.querySelector("#edit-profile-modal");
const editSubmitButton = editModal.querySelector(".modal__save-button");
const editFormElement = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const profileCloseButton = document.querySelector(".modal__close-button");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//Add to profile elements
const addModal = document.querySelector("#add-card-modal");
const addFormElement = addModal.querySelector(".modal__form");
const profileAddButton = document.querySelector(".profile__add-button");
const addModalCloseButton = addModal.querySelector(".modal__close-button");
const addCardNameInput = addModal.querySelector("#add-card-name-input");
const addCardLinkInput = addModal.querySelector("#add-card-link-input");
const modalSubmitButton = addModal.querySelector(".modal__save-button");

//preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalClose = previewModal.querySelector(".modal__close-button");
const modals = document.querySelectorAll(".modal");

//Avatar modal elements
const avatarEditButton = document.querySelector(".profile__avatar-edit-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__save-button");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileAvatar = document.querySelector(".profile__avatar");

//Delete modal elements
const deleteModal = document.querySelector("#delete-modal");
const modalDeleteCloseButton = deleteModal.querySelector(
  ".modal__close-button"
);
const deleteSubmitButton = deleteModal.querySelector(".modal__save-button");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelButton = deleteModal.querySelector(
  ".modal__save-button--cancel"
);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3a5bcfe2-e335-4388-a398-807bd8dd2046",
    "Content-Type": "application/json",
  },
});

let selectedCard;
let selectedCardId;

api
  .loadPageData()
  .then(([userData, cards]) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    document.querySelector(".profile__avatar").src = userData.avatar;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

function handleLike(evt, id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__card-button_liked");

  api
    .toggleLikes(id, isLiked)
    .then((data) => {
      evt.target.classList.toggle("card__card-button_liked");
    })
    .catch((err) => {
      console.error(err);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  cardNameElement.textContent = data.name;

  const cardImageElement = cardElement.querySelector(".card__image");
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const cardLikeButton = cardElement.querySelector(".card__card-button");

  const cardDeleteButton = cardElement.querySelector(
    ".card__card-delete-button"
  );

  if (data.isLiked) {
    cardLikeButton.classList.add("card__card-button_liked");
  }

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  //Set the listener on delete button
  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

//functions

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

//edit form
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editSubmitButton.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      //use data argument instead of input values
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      editSubmitButton.textContent = "Save";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  avatarSubmitButton.textContent = "Saving...";
  api
    .editAvatarUserInfo(avatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      evt.target.reset();
      closeModal(avatarModal);
      disableButton(avatarSubmitButton, settings);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      avatarSubmitButton.textContent = "Save";
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  deleteSubmitButton.textContent = "Deleting...";
  api
    .removeCard(selectedCardId)
    .then((data) => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      deleteSubmitButton.textContent = "Delete";
    });
}

//close modal by clicking overlay
modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

//function for handling escape key and close modal

const handleEscapeKey = (evt) => {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
};

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  modalSubmitButton.textContent = "Saving...";
  api
    .addNewCardPost({
      name: addCardNameInput.value,
      link: addCardLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(modalSubmitButton, settings);
      closeModal(addModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      modalSubmitButton.textContent = "Save";
    });
}

//event listeners

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

avatarEditButton.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarInput], settings);
  openModal(avatarModal);
});

modalDeleteCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

profileCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(addModal);
});

addModalCloseButton.addEventListener("click", () => {
  closeModal(addModal);
});

previewModalClose.addEventListener("click", () => {
  closeModal(previewModal);
});

addFormElement.addEventListener("submit", handleAddCardSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

enableValidation(settings);
