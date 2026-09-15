/* =============================================
   VIDFLOW CREATOR DASHBOARD (NODE.JS / EXPRESS)
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
   BACKEND REST API & VIDEO DATA
============================================= */

let videos = [];

/**
 * Fetch all videos from Express backend API
 */
async function loadVideos() {
  try {
    const response = await fetch('/api/videos');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    videos = await response.json();
    updateEverything();
  } catch (err) {
    console.error('Failed to load videos from server:', err);
  }
}

/**
 * Create a new video via Express backend API
 */
async function createVideoOnBackend(videoData) {
  try {
    const response = await fetch('/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(videoData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save video');
    }

    const savedVideo = await response.json();
    await loadVideos();
    return savedVideo;
  } catch (err) {
    console.error('Error creating video:', err);
    alert(`Error saving video: ${err.message}`);
    return null;
  }
}

/**
 * Delete a video via Express backend API
 */
async function deleteVideoOnBackend(id) {
  try {
    const response = await fetch(`/api/videos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete video');
    }

    await loadVideos();
    return true;
  } catch (err) {
    console.error('Error deleting video:', err);
    alert(`Error deleting video: ${err.message}`);
    return false;
  }
}


/* =============================================
   YOUTUBE API SERVICE (MODULAR ABSTRACTION)
============================================= */

const YouTubeService = {
  async getStatus() {
    try {
      const res = await fetch('/api/youtube/status');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('YouTube status API offline:', e);
    }
    return { connected: localStorage.getItem("youtubeConnected") !== "false" };
  },

  async connectChannel() {
    try {
      const res = await fetch('/api/youtube/connect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("youtubeConnected", "true");
        return data;
      }
    } catch (e) {
      console.warn('YouTube connect API fallback:', e);
    }
    localStorage.setItem("youtubeConnected", "true");
    return { connected: true, channelTitle: "Subhana Official" };
  },

  async disconnectChannel() {
    try {
      const res = await fetch('/api/youtube/disconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("youtubeConnected", "false");
        return data;
      }
    } catch (e) {
      console.warn('YouTube disconnect API fallback:', e);
    }
    localStorage.setItem("youtubeConnected", "false");
    return { connected: false };
  },

  async fetchChannelStats() {
    try {
      const res = await fetch('/api/youtube/stats');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('YouTube stats API fallback:', e);
    }
    return {
      subscribers: "12,480",
      views: "148,200",
      watchTime: "4,320 hrs",
      growth: "+20%"
    };
  }
};


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

function getVideoDescription() {
  const descInput = document.getElementById("videoDescription");
  return descInput?.value.trim() || "";
}


/* =============================================
   SAVE AS DRAFT
============================================= */

const saveDraftButton = document.getElementById("saveDraftButton");

if (saveDraftButton) {
  saveDraftButton.addEventListener("click", async () => {
    const title = getVideoTitle();

    if (!title) {
      alert("Please enter a video title first.");
      return;
    }

    const description = getVideoDescription();
    const today = getTodayString();

    const draftData = {
      title: title,
      description: description,
      date: today,
      time: "",
      status: "draft"
    };

    saveDraftButton.disabled = true;
    saveDraftButton.textContent = "Saving...";

    const result = await createVideoOnBackend(draftData);

    saveDraftButton.disabled = false;
    saveDraftButton.textContent = "Save Draft";

    if (result) {
      clearUploadForm();
      alert("Video saved as draft!");
    }
  });
}


/* =============================================
   PUBLISH / SCHEDULE
============================================= */

if (publishButton) {
  publishButton.addEventListener("click", async () => {
    const title = getVideoTitle();

    if (!title) {
      alert("Please enter a video title.");
      return;
    }

    const description = getVideoDescription();
    const selectedOption = document.querySelector('input[name="publish"]:checked');
    if (!selectedOption) return;

    /* PUBLISH NOW */
    if (selectedOption.value === "now") {
      const now = new Date();
      const videoData = {
        title: title,
        description: description,
        publishedDate: formatDateForDatabase(now),
        publishedTime: formatTimeForDatabase(now),
        date: formatDateForDatabase(now),
        time: formatTimeForDatabase(now),
        status: "published"
      };

      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      const result = await createVideoOnBackend(videoData);

      publishButton.disabled = false;
      publishButton.textContent = "Publish Video";

      if (result) {
        clearUploadForm();
        alert("Video published successfully!");
        openPlannerAtDate(result.date);
      }
    }

    /* SCHEDULE */
    if (selectedOption.value === "schedule") {
      const date = document.getElementById("scheduleDate").value;
      const time = document.getElementById("scheduleTime").value;

      if (!date || !time) {
        alert("Please select both date and time.");
        return;
      }

      const selectedDateTime = new Date(`${date}T${time}`);
      if (selectedDateTime < new Date()) {
        alert("Please choose a future date and time.");
        return;
      }

      const videoData = {
        title: title,
        description: description,
        scheduledDate: date,
        scheduledTime: time,
        date: date,
        time: time,
        status: "scheduled"
      };

      publishButton.disabled = true;
      publishButton.textContent = "Scheduling...";

      const result = await createVideoOnBackend(videoData);

      publishButton.disabled = false;
      publishButton.textContent = "Schedule Video";

      if (result) {
        clearUploadForm();
        alert("Video scheduled successfully!");
        openPlannerAtDate(date);
      }
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
   CALENDAR & PLANNER
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

  /* EMPTY DAYS FOR PRECEDING MONTH PADDING */
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
   MONTH NAVIGATION BUTTONS
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
    if (!video.date) return false;
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
   CLICK DATE HANDLER
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

    const thumbnailSrc = video.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80";

    row.innerHTML = `
      <div class="planner-video-left">
        <div class="planner-thumbnail">
          <img src="${escapeHTML(thumbnailSrc)}" alt="Thumbnail" onerror="this.onerror=null;this.parentElement.innerHTML='▶';" />
        </div>
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
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.id);
      const video = videos.find(item => item.id === id);

      if (!video) return;

      const confirmDelete = confirm(`Delete "${video.title}"?`);
      if (!confirmDelete) return;

      button.disabled = true;
      const success = await deleteVideoOnBackend(id);

      if (success) {
        if (selectedCalendarDate) {
          showVideosForDate(selectedCalendarDate);
        } else {
          showMonthVideos();
        }
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
  if (!dateString) return;
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
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function readableTime(time) {
  if (!time) return "";
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
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHTML(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


/* =============================================
   INITIALIZE APPLICATION
============================================= */

// Load all videos from Express API and render dashboard
loadVideos();
