const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const filterButtons = document.querySelectorAll("[data-filter]");
const routeCards = document.querySelectorAll("[data-category]");
const plannerForm = document.querySelector("[data-planner-form]");
const plannerOutput = document.querySelector("[data-planner-output]");
const bookingForm = document.querySelector("[data-booking-form]");
const bookingNote = document.querySelector("[data-booking-note]");
const supportChat = document.querySelector("[data-support-chat]");
const supportOpen = document.querySelector("[data-support-open]");
const supportClose = document.querySelector("[data-support-close]");
const supportMessages = document.querySelector("[data-support-messages]");
const supportForm = document.querySelector("[data-support-form]");
const supportQuestions = document.querySelectorAll("[data-support-question]");

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    routeCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(plannerForm);
  const destination = formData.get("destination").trim();
  const style = formData.get("style");
  const days = formData.get("days");

  plannerOutput.value = `${days} days in ${destination}: start with one visual hook, map the most scenic stop, add a food or stay recommendation, and close with a save-worthy packing note. Travel style: ${style}.`;
});

const updateBookingNote = () => {
  if (!bookingForm || !bookingNote) return;

  const formData = new FormData(bookingForm);
  const selectedDestination = formData.get("destination");
  const customPlace = formData.get("customPlace").trim();
  const destination = customPlace || selectedDestination;
  const travelers = formData.get("travelers");
  const month = formData.get("month") || "flexible month";
  const budget = formData.get("budget");

  bookingNote.textContent = `DM message idea: Hi Trailz Uncharted, I want to plan ${destination} for ${travelers} traveler(s) in ${month}. Budget style: ${budget}. Please share route and booking details.`;
};

if (bookingForm) {
  bookingForm.addEventListener("input", updateBookingNote);
  bookingForm.addEventListener("change", updateBookingNote);
  updateBookingNote();
}

const supportAnswers = {
  booking:
    "For trip booking, choose Booking in the menu. Select destination, travelers, month, and budget, then open Instagram DM to send the enquiry.",
  reels:
    "You can watch Trailz reels in the Reels section. Each card opens the matching Instagram Reel in a new tab.",
  places:
    "Trailz has travelled all Indian states plus Bangladesh, Bhutan, Nepal, Malaysia, Singapore, Dubai, and Oman. The Visited section shows this experience separately from booking.",
  contact:
    "The fastest support is Instagram DM. Tap Continue in Instagram DM and send your question to Trailz Uncharted.",
  default:
    "I can help with booking, reels, places, and contact details. For a personal answer, continue in Instagram DM."
};

const addSupportMessage = (text, type = "bot") => {
  if (!supportMessages) return;

  const message = document.createElement("div");
  message.className = `support-message ${type}`;
  message.textContent = text;
  supportMessages.appendChild(message);
  supportMessages.scrollTop = supportMessages.scrollHeight;
};

const getSupportAnswer = (question) => {
  const text = question.toLowerCase();

  if (text.includes("book") || text.includes("trip") || text.includes("price") || text.includes("budget")) {
    return supportAnswers.booking;
  }

  if (text.includes("reel") || text.includes("video") || text.includes("instagram")) {
    return supportAnswers.reels;
  }

  if (text.includes("place") || text.includes("destination") || text.includes("country") || text.includes("travel") || text.includes("experience")) {
    return supportAnswers.places;
  }

  if (text.includes("contact") || text.includes("dm") || text.includes("support") || text.includes("help")) {
    return supportAnswers.contact;
  }

  return supportAnswers.default;
};

const toggleSupport = (open) => {
  if (!supportChat) return;

  supportChat.classList.toggle("open", open);
  supportChat.setAttribute("aria-hidden", String(!open));
};

supportOpen?.addEventListener("click", () => toggleSupport(true));
supportClose?.addEventListener("click", () => toggleSupport(false));

supportQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.supportQuestion;
    addSupportMessage(button.textContent, "user");
    addSupportMessage(supportAnswers[key] || supportAnswers.default);
  });
});

supportForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = supportForm.elements.question;
  const question = input.value.trim();
  if (!question) return;

  addSupportMessage(question, "user");
  addSupportMessage(getSupportAnswer(question));
  input.value = "";
});

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
