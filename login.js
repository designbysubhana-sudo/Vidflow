const loginCard = document.getElementById("loginCard");
const signupCard = document.getElementById("signupCard");
const openSignup = document.getElementById("openSignup");
const openLogin = document.getElementById("openLogin");

/* SWITCH TO SIGN UP */
if (openSignup) {
  openSignup.addEventListener("click", () => {
    loginCard.classList.add("hidden");
    signupCard.classList.remove("hidden");
  });
}

/* SWITCH TO LOGIN */
if (openLogin) {
  openLogin.addEventListener("click", () => {
    signupCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
  });
}

/* ===============================
   SIGN UP
================================ */
const signupForm = document.getElementById("signupForm");
const signupError = document.getElementById("signupError");

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (signupError) signupError.textContent = "";

    if (password !== confirmPassword) {
      if (signupError) signupError.textContent = "Passwords do not match.";
      return;
    }

    if (password.length < 6) {
      if (signupError) signupError.textContent = "Password must be at least 6 characters.";
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("vidflowUsers")) || [];
    const userAlreadyExists = existingUsers.some(user => user.email === email);

    if (userAlreadyExists) {
      if (signupError) signupError.textContent = "An account with this email already exists.";
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password
    };

    existingUsers.push(newUser);
    localStorage.setItem("vidflowUsers", JSON.stringify(existingUsers));

    alert("Account created successfully!");
    signupForm.reset();

    signupCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
  });
}

/* ===============================
   LOGIN
================================ */
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("vidflowUsers")) || [];
    const user = users.find(account => account.email === email && account.password === password);

    if (!user) {
      if (loginError) loginError.textContent = "Incorrect email or password.";
      return;
    }

    /* Save logged-in user */
    localStorage.setItem(
      "vidflowCurrentUser",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      })
    );

    /* OPEN VIDFLOW */
    window.location.href = "index.html";
  });
}
