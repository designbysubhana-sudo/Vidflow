/* =============================================
   VIDFLOW CREATOR DASHBOARD
============================================= */

/* POPULATE CREATOR PROFILE INFO */
const profileName = document.querySelector(".profile strong");
const welcomeText = document.getElementById("welcomeText");

const savedProfileName = localStorage.getItem("vidflowProfileName") || "Subhana";
if (profileName) {
  profileName.textContent = savedProfileName;
}

if (welcomeText) {
  welcomeText.textContent = `WELCOME BACK, ${savedProfileName.toUpperCase()} 👋`;
}


/* =============================================
   PAGE NAVIGATION
============================================= */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

function openPage(pageName) {
  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  navItems.forEach(item => {
    item.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageName);
  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }

  const selectedNav = document.querySelector(`[data-page="${pageName}"]`);
  if (selectedNav) {
    selectedNav.classList.add("active");
  }
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    openPage(item.dataset.page);
  });
});


/* =============================================
   HOME BUTTONS
============================================= */

const homeUploadButton = document.getElementById("homeUploadButton");
const quickUpload = document.getElementById("quickUpload");
const quickPlanner = document.getElementById("quickPlanner");
const quickAnalytics = document.getElementById("quickAnalytics");

if (homeUploadButton) {
  homeUploadButton.addEventListener("click", () => openPage("upload"));
}

if (quickUpload) {
  quickUpload.addEventListener("click", () => openPage("upload"));
}

if (quickPlanner) {
  quickPlanner.addEventListener("click", () => {
    openPage("planner");
    resetPlannerView();
  });
}

if (quickAnalytics) {
  quickAnalytics.addEventListener("click", () => openPage("dashboard"));
}


/* =============================================
   YOUTUBE API SERVICE (MODULAR ABSTRACTION)
============================================= */

const YouTubeService = {
  async connectChannel() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("youtubeConnected", "true");
        resolve({
          connected: true,
          channelName: "Subhana Official",
          subscribers: "12.4K"
        });
      }, 200);
    });
  },

  async disconnectChannel() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("youtubeConnected", "false");
        resolve({ connected: false });
      }, 200);
    });
  },

  async fetchChannelStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          subscribers: "12,480",
          views: "148,200",
          watchTime: "4,320 hrs",
          growth: "+20%"
        });
      }, 150);
    });
  },

  async uploadVideo(videoData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          youtubeId: "yt_" + Date.now(),
          ...videoData
        });
      }, 300);
    });
  }
};


/* =============================================
   SAMPLE VIDEO DATABASE (DYNAMIC DATE GENERATION)
============================================= */

function generateDefaultVideos() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const prevMonthDate = new Date(year, month - 1, 22);
  const latePrevMonthDate = new Date(year, month - 1, 29);
  const earlyCurrMonthDate = new Date(year, month, 3);
  const midCurrMonthDate = new Date(year, month, 15);
  const lateCurrMonthDate = new Date(year, month, 22);
  const draftDate = new Date(year, month, 18);

  return [
    {
      id: 1,
      title: "How I Plan My Content",
      date: formatDateForDatabase(prevMonthDate),
      time: "11:00",
      status: "published"
    },
    {
      id: 2,
      title: "My Productivity Setup",
      date: formatDateForDatabase(latePrevMonthDate),
      time: "14:30",
      status: "published"
    },
    {
      id: 3,
      title: "Q&A With Subscribers",
      date: formatDateForDatabase(earlyCurrMonthDate),
      time: "16:00",
      status: "published"
    },
    {
      id: 4,
      title: "UI/UX Design Tips",
      date: formatDateForDatabase(midCurrMonthDate),
      time: "10:00",
      status: "scheduled"
    },
    {
      id: 5,
      title: "My Workspace Tour",
      date: formatDateForDatabase(lateCurrMonthDate),
      time: "12:00",
      status: "scheduled"
    },
    {
      id: 6,
      title: "New Video Idea",
      date: formatDateForDatabase(draftDate),
      time: "",
      status: "draft"
    }
  ];
}


/* =============================================
   LOCAL STORAGE
============================================= */

let videos = JSON.parse(localStorage.getItem("vidflowVideos"));

if (!videos || !Array.isArray(videos) || videos.length === 0) {
  videos = generateDefaultVideos();
  saveVideos();
}

function saveVideos() {
  localStorage.setItem("vidflowVideos", JSON.stringify(videos));
}


/* =============================================
   FILE UPLOAD & DRAG-DROP
============================================= */

const videoFile = document.getElementById("videoFile");
const fileName = document.getElementById("fileName");
const dropArea = document.getElementById("dropArea");

if (videoFile) {
  videoFile.addEventListener("change", () => {
    if (videoFile.files.length > 0) {
      fileName.textContent = videoFile.files[0].name;
    } else {
      fileName.textContent = "No file selected";
    }
  });
}

if (dropArea && videoFile && fileName) {
  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropArea.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropArea.classList.remove("dragover");
    });
  });

  dropArea.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      videoFile.files = files;
      fileName.textContent = files[0].name;
    }
  });
}


/* =============================================
   PUBLISH OPTIONS
============================================= */

const publishOptions = document.querySelectorAll('input[name="publish"]');
const scheduleOptions = document.getElementById("scheduleOptions");
const publishButton = document.getElementById("publishButton");

publishOptions.forEach(option => {
  option.addEventListener("change", () => {
    if (option.value === "schedule" && option.checked) {
      scheduleOptions.classList.add("show");
      publishButton.textContent = "Schedule Video";
    }

    if (option.value === "now" && option.checked) {
      scheduleOptions.classList.remove("show");
      publishButton.textContent = "Publish Video";
    }
  });
});


/* =============================================
   GET FORM DATA
============================================= */

function getVideoTitle() {
  const titleInput = document.getElementById("videoTitle");
  return titleInput?.value.trim() || "";
}


/* =============================================
   SAVE AS DRAFT
============================================= */

const saveDraftButton = document.getElementById("saveDraftButton");

if (saveDraftButton) {
  saveDraftButton.addEventListener("click", () => {
    const title = getVideoTitle();

    if (!title) {
      alert("Please enter a video title first.");
      return;
    }

    const today = getTodayString();
    const draft = {
      id: Date.now(),
      title: title,
      date: today,
      time: "",
      status: "draft"
    };

    videos.push(draft);
    saveVideos();
    updateEverything();
    clearUploadForm();

    alert("Video saved as draft.");
  });
}


/* =============================================
   PUBLISH / SCHEDULE
============================================= */

if (publishButton) {
  publishButton.addEventListener("click", () => {
    const title = getVideoTitle();

    if (!title) {
      alert("Please enter a video title.");
      return;
    }

    const selectedOption = document.querySelector('input[name="publish"]:checked');
    if (!selectedOption) return;

    /* PUBLISH NOW */
    if (selectedOption.value === "now") {
      const now = new Date();
      const newVideo = {
        id: Date.now(),
        title: title,
        date: formatDateForDatabase(now),
        time: formatTimeForDatabase(now),
        status: "published"
      };

      videos.push(newVideo);
      saveVideos();
      updateEverything();
      clearUploadForm();

      alert("Video published successfully!");
      openPlannerAtDate(newVideo.date);
    }

    /* SCHEDULE */
    if (selectedOption.value === "schedule") {
      const date = document.getElementById("scheduleDate").value;
      const time = document.getElementById("scheduleTime").value;

      if (!date || !time) {
        alert("Please select date and time.");
        return;
      }

      const selectedDateTime = new Date(`${date}T${time}`);
      if (selectedDateTime < new Date()) {
        alert("Please choose a future date and time.");
        return;
      }

      const newVideo = {
        id: Date.now(),
        title: title,
        date: date,
        time: time,
        status: "scheduled"
      };

      videos.push(newVideo);
      saveVideos();
      updateEverything();
      clearUploadForm();

      alert("Video scheduled successfully!");
      openPlannerAtDate(date);
    }
  });
}


/* =============================================
   CLEAR FORM
============================================= */

function clearUploadForm() {
  const title = document.getElementById("videoTitle");
  const description = document.getElementById("videoDescription");

  if (title) title.value = "";
  if (description) description.value = "";
  if (videoFile) videoFile.value = "";
  if (fileName) fileName.textContent = "No file selected";

  const publishNow = document.querySelector('input[name="publish"][value="now"]');
  if (publishNow) publishNow.checked = true;

  if (scheduleOptions) scheduleOptions.classList.remove("show");
  if (publishButton) publishButton.textContent = "Publish Video";
}


/* =============================================
   CALENDAR
============================================= */

const calendarMonth = document.getElementById("calendarMonth");
const calendarDays = document.getElementById("calendarDays");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const plannerList = document.getElementById("plannerList");
const plannerTitle = document.getElementById("plannerTitle");
const plannerSubtitle = document.getElementById("plannerSubtitle");

let calendarDate = new Date();
let currentFilter = "all";
let selectedCalendarDate = null;


/* =============================================
   RENDER CALENDAR
============================================= */

function renderCalendar() {
  if (!calendarMonth || !calendarDays) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarMonth.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(new Date(year, month, 1));

  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const numberOfDays = new Date(year, month + 1, 0).getDate();

  /* EMPTY DAYS */
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarDays.appendChild(empty);
  }

  /* REAL DAYS */
  for (let day = 1; day <= numberOfDays; day++) {
    const dateString = createDateString(year, month, day);
    const box = document.createElement("button");
    box.type = "button";
    box.className = "calendar-day";

    if (dateString === getTodayString()) {
      box.classList.add("today");
    }

    if (dateString === selectedCalendarDate) {
      box.classList.add("selected-day");
    }

    const number = document.createElement("span");
    number.className = "calendar-number";
    number.textContent = day;
    box.appendChild(number);

    const dateVideos = videos.filter(video => video.date === dateString);

    if (dateVideos.length > 0) {
      const eventArea = document.createElement("div");
      eventArea.className = "calendar-events";

      const statuses = [...new Set(dateVideos.map(video => video.status))];
      statuses.forEach(status => {
        const dot = document.createElement("span");
        dot.className = `event-dot ${status}`;
        eventArea.appendChild(dot);
      });

      if (dateVideos.length > 1) {
        const count = document.createElement("small");
        count.className = "event-count";
        count.textContent = `+${dateVideos.length}`;
        eventArea.appendChild(count);
      }

      box.appendChild(eventArea);
    }

    box.addEventListener("click", () => {
      selectedCalendarDate = dateString;
      renderCalendar();
      showVideosForDate(dateString);
    });

    calendarDays.appendChild(box);
  }

  if (!selectedCalendarDate) {
    showMonthVideos();
  }
}


/* =============================================
   MONTH BUTTONS
============================================= */

if (prevMonthButton) {
  prevMonthButton.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    selectedCalendarDate = null;
    renderCalendar();
    showMonthVideos();
  });
}

if (nextMonthButton) {
  nextMonthButton.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    selectedCalendarDate = null;
    renderCalendar();
    showMonthVideos();
  });
}


/* =============================================
   SHOW MONTH VIDEOS
============================================= */

function showMonthVideos() {
  if (!plannerList) return;
  selectedCalendarDate = null;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  let monthVideos = videos.filter(video => {
    const parts = video.date.split("-");
    const videoYear = Number(parts[0]);
    const videoMonth = Number(parts[1]) - 1;
    return videoYear === year && videoMonth === month;
  });

  monthVideos = applyFilter(monthVideos);
  monthVideos.sort(sortVideos);

  if (plannerTitle) plannerTitle.textContent = "Monthly Content";
  if (plannerSubtitle) plannerSubtitle.textContent = "Published, scheduled and draft videos";

  renderVideoList(monthVideos);
}


/* =============================================
   CLICK DATE
============================================= */

function showVideosForDate(dateString) {
  let dateVideos = videos.filter(video => video.date === dateString);
  dateVideos = applyFilter(dateVideos);
  dateVideos.sort(sortVideos);

  if (plannerTitle) plannerTitle.textContent = readableDate(dateString);
  if (plannerSubtitle) plannerSubtitle.textContent = `${dateVideos.length} content item(s)`;

  renderVideoList(dateVideos);
}


/* =============================================
   RENDER VIDEO LIST
============================================= */

function renderVideoList(list) {
  if (!plannerList) return;
  plannerList.innerHTML = "";

  if (list.length === 0) {
    plannerList.innerHTML = `<div class="planner-empty">No content found.</div>`;
    return;
  }

  list.forEach(video => {
    const row = document.createElement("div");
    row.className = "planner-video";

    row.innerHTML = `
      <div class="planner-video-left">
        <div class="planner-thumbnail">▶</div>
        <div>
          <h4>${escapeHTML(video.title)}</h4>
          <p>${readableDate(video.date)} ${video.time ? " • " + readableTime(video.time) : ""}</p>
        </div>
      </div>

      <div class="planner-video-actions">
        <span class="video-status ${video.status}">${capitalize(video.status)}</span>
        <button class="delete-video" data-id="${video.id}" title="Delete video">×</button>
      </div>
    `;

    plannerList.appendChild(row);
  });

  addDeleteListeners();
}


/* =============================================
   DELETE VIDEO
============================================= */

function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-video");
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const video = videos.find(item => item.id === id);

      if (!video) return;

      const confirmDelete = confirm(`Delete "${video.title}"?`);
      if (!confirmDelete) return;

      videos = videos.filter(item => item.id !== id);
      saveVideos();
      updateEverything();

      if (selectedCalendarDate) {
        showVideosForDate(selectedCalendarDate);
      } else {
        showMonthVideos();
      }
    });
  });
}


/* =============================================
   FILTERS
============================================= */

const plannerFilters = document.querySelectorAll(".planner-filter");
plannerFilters.forEach(button => {
  button.addEventListener("click", () => {
    plannerFilters.forEach(item => item.classList.remove("active-filter"));
    button.classList.add("active-filter");
    currentFilter = button.dataset.filter;

    if (selectedCalendarDate) {
      showVideosForDate(selectedCalendarDate);
    } else {
      showMonthVideos();
    }
  });
});

function applyFilter(list) {
  if (currentFilter === "all") return list;
  return list.filter(video => video.status === currentFilter);
}


/* =============================================
   VIEW ALL
============================================= */

const showAllContent = document.getElementById("showAllContent");
if (showAllContent) {
  showAllContent.addEventListener("click", () => {
    selectedCalendarDate = null;
    currentFilter = "all";
    plannerFilters.forEach(button => {
      button.classList.toggle("active-filter", button.dataset.filter === "all");
    });

    showMonthVideos();
    renderCalendar();
  });
}


/* =============================================
   OPEN PLANNER ON VIDEO DATE
============================================= */

function openPlannerAtDate(dateString) {
  const [year, month] = dateString.split("-").map(Number);
  calendarDate = new Date(year, month - 1, 1);
  selectedCalendarDate = dateString;
  openPage("planner");
  renderCalendar();
  showVideosForDate(dateString);
}


/* =============================================
   RESET PLANNER
============================================= */

function resetPlannerView() {
  selectedCalendarDate = null;
  currentFilter = "all";
  plannerFilters.forEach(button => {
    button.classList.toggle("active-filter", button.dataset.filter === "all");
  });
  renderCalendar();
  showMonthVideos();
}


/* =============================================
   SETTINGS & PROFILE EDIT
============================================= */

const disconnectButton = document.getElementById("disconnectButton");
let youtubeConnected = localStorage.getItem("youtubeConnected") !== "false";

if (disconnectButton) {
  updateYoutubeButton();

  disconnectButton.addEventListener("click", async () => {
    if (youtubeConnected) {
      const answer = confirm("Disconnect YouTube channel?");
      if (!answer) return;
      await YouTubeService.disconnectChannel();
      youtubeConnected = false;
    } else {
      await YouTubeService.connectChannel();
      youtubeConnected = true;
      alert("YouTube channel connected.");
    }

    localStorage.setItem("youtubeConnected", youtubeConnected);
    updateYoutubeButton();
  });
}

function updateYoutubeButton() {
  if (!disconnectButton) return;
  disconnectButton.textContent = youtubeConnected ? "Disconnect" : "Connect YouTube";

  const connected = document.querySelector(".connected");
  if (connected) {
    connected.textContent = youtubeConnected ? "● Connected" : "● Not Connected";
    connected.style.color = youtubeConnected ? "#46d37c" : "#ff537b";
  }
}

const editProfileButton = document.getElementById("editProfileButton");
if (editProfileButton) {
  const savedName = localStorage.getItem("vidflowProfileName");
  const savedEmail = localStorage.getItem("vidflowProfileEmail");

  if (savedName) {
    const profileNameInput = document.getElementById("profileName");
    if (profileNameInput) profileNameInput.value = savedName;
    if (profileName) profileName.textContent = savedName;
  }

  if (savedEmail) {
    const profileEmailInput = document.getElementById("profileEmail");
    if (profileEmailInput) profileEmailInput.value = savedEmail;
  }

  editProfileButton.addEventListener("click", () => {
    const profileNameInput = document.getElementById("profileName");
    const profileEmailInput = document.getElementById("profileEmail");

    const newName = profileNameInput ? profileNameInput.value.trim() : "";
    const newEmail = profileEmailInput ? profileEmailInput.value.trim() : "";

    if (newName) {
      localStorage.setItem("vidflowProfileName", newName);
      if (profileName) profileName.textContent = newName;
      if (welcomeText) welcomeText.textContent = `WELCOME BACK, ${newName.toUpperCase()} 👋`;
    }

    if (newEmail) {
      localStorage.setItem("vidflowProfileEmail", newEmail);
    }

    alert("Profile changes saved.");
  });
}


/* =============================================
   HELPER FUNCTIONS
============================================= */

function updateEverything() {
  renderCalendar();
  updateHomeStats();
}

function updateHomeStats() {
  const publishedCount = videos.filter(video => video.status === "published").length;
  const scheduledCount = videos.filter(video => video.status === "scheduled").length;
  const draftCount = videos.filter(video => video.status === "draft").length;

  const statCards = document.querySelectorAll("#home .stat-card");
  if (statCards.length >= 3) {
    const publishedElem = statCards[0].querySelector("h2");
    if (publishedElem) publishedElem.textContent = publishedCount;

    const scheduledElem = statCards[1].querySelector("h2");
    if (scheduledElem) scheduledElem.textContent = scheduledCount;

    const draftElem = statCards[2].querySelector("h2");
    if (draftElem) draftElem.textContent = draftCount;
  }
}

function createDateString(year, month, day) {
  return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function getTodayString() {
  return formatDateForDatabase(new Date());
}

function formatDateForDatabase(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function formatTimeForDatabase(date) {
  return String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");
}

function readableDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function readableTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function sortVideos(a, b) {
  return new Date(`${a.date}T${a.time || "00:00"}`) - new Date(`${b.date}T${b.time || "00:00"}`);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


/* =============================================
   START APP
============================================= */

renderCalendar();
showMonthVideos();
updateHomeStats();
