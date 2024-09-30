const initialCards = [
  {
    name: "A man standing on the beach next to palm trees",
    link: "https://unsplash.com/photos/a-man-standing-on-a-beach-next-to-palm-trees-aGiM4CYG27s",
  },
  {
    name: "Waking up in the Venezuelan coast",
    link: "https://unsplash.com/photos/person-walking-on-beach-during-daytime-fP44mZBa2zQ",
  },
  {
    name: "White clouds and blue skies during daytime in Rio",
    link: "https://unsplash.com/photos/white-clouds-and-blue-sky-during-daytime-XAiPD7cY7aQ",
  },
  {
    name: "A formidable beast",
    link: "https://unsplash.com/photos/closeup-photo-of-brown-tabby-cat-AM9ZtoUss68",
  },
  {
    name: "Unidentified aerial phenomena on a green sky",
    link: "https://unsplash.com/photos/green-and-black-trees-under-blue-sky-HWQXIYbs8PM",
  },
  {
    name: "Freedom achieved",
    link: "https://unsplash.com/photos/two-person-running-on-seaside-beach-during-daytime-Fg9l2rojs24",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");

const editModal = document.querySelector("#edit-profile-modal");

const closeModalButton = document.querySelector(".modal__close-button");

function openModal() {
  editModal.classList.add("modal_opened");
}

function closeModal() {
  editModal.classList.remove("modal_opened");
}

profileEditButton.addEventListener("click", function () {
  openModal();
});

closeModalButton.addEventListener("click", function () {
  closeModal();
});
