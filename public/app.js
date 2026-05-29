const services = [
  {
    id: "daily",
    name: "Daily office cleaning",
    copy: "Desk dusting, floors, trash removal, pantry resets, and opening-ready common areas.",
    price: 1400,
    icon: "sparkles",
  },
  {
    id: "deep",
    name: "Deep safai",
    copy: "Machine scrubbing, corners, partitions, upholstery touch-ups, and post-event recovery.",
    price: 3200,
    icon: "brush",
  },
  {
    id: "washroom",
    name: "Washroom care",
    copy: "High-frequency washroom cleaning with consumable checks and odor-control routines.",
    price: 1800,
    icon: "droplets",
  },
  {
    id: "sanitizing",
    name: "Surface sanitizing",
    copy: "Meeting rooms, reception, biometric areas, pantry counters, and shared equipment.",
    price: 2200,
    icon: "shield",
  },
];

const plans = [
  {
    name: "One-time",
    price: "From Rs 2,400",
    copy: "For inspections, events, new move-ins, or urgent cleanup.",
    bullets: ["One visit", "Digital checklist", "Supervisor callback"],
  },
  {
    name: "Monthly care",
    price: "Custom",
    copy: "For offices that need reliable daily or alternate-day support.",
    bullets: ["Dedicated crew", "Branch schedule", "Weekly service logs"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "SLA based",
    copy: "For multi-floor, multi-branch, and managed facility needs.",
    bullets: ["Account manager", "Audit reports", "Escalation desk"],
  },
];

const sizeMultipliers = {
  small: 1,
  medium: 1.65,
  large: 2.7,
  enterprise: 4.2,
};

const registrationKey = "safaibroStaffRegistrations";

const iconPaths = {
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 16l.9 2.6 2.6.9-2.6.9L19 23l-.9-2.6-2.6-.9 2.6-.9L19 16Z"/>',
  brush: '<path d="M9 20h6"/><path d="M11 17h2c1.7 0 3-1.3 3-3V4H8v10c0 1.7 1.3 3 3 3Z"/><path d="M8 4h8"/><path d="M12 20v-3"/>',
  droplets: '<path d="M12 3s5 5.4 5 9a5 5 0 0 1-10 0c0-3.6 5-9 5-9Z"/><path d="M18.5 15.5s2.5 2.8 2.5 4.5a2.5 2.5 0 0 1-5 0c0-1.7 2.5-4.5 2.5-4.5Z"/>',
  shield: '<path d="M12 3l8 3v5c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-3Z"/><path d="M9 12l2 2 4-5"/>',
};

const money = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function serviceIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;
}

function renderServices() {
  const grid = document.querySelector("#serviceGrid");
  const options = document.querySelector("#serviceOptions");

  grid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card">
          <span class="service-icon">${serviceIcon(service.icon)}</span>
          <h3>${service.name}</h3>
          <p>${service.copy}</p>
        </article>
      `
    )
    .join("");

  options.innerHTML = services
    .map(
      (service, index) => `
        <label class="check-option">
          <input type="checkbox" name="services" value="${service.id}" ${index === 0 ? "checked" : ""}>
          <span>${service.name}</span>
        </label>
      `
    )
    .join("");
}

function renderPlans() {
  document.querySelector("#planGrid").innerHTML = plans
    .map(
      (plan) => `
        <article class="plan-card ${plan.featured ? "featured" : ""}">
          <h3>${plan.name}</h3>
          <strong>${plan.price}</strong>
          <p>${plan.copy}</p>
          <ul>
            ${plan.bullets.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function selectedServiceIds() {
  return [...document.querySelectorAll('input[name="services"]:checked')].map((input) => input.value);
}

function estimateQuote() {
  const selected = selectedServiceIds();
  const size = document.querySelector("#officeSize").value;
  const subtotal = selected.reduce((total, id) => {
    const service = services.find((item) => item.id === id);
    return total + (service?.price || 0);
  }, 0);
  const estimate = Math.max(2400, Math.round((subtotal || 1400) * sizeMultipliers[size] / 100) * 100);
  document.querySelector("#quoteAmount").textContent = `Rs ${money.format(estimate)}`;
  return estimate;
}

function setMinDate() {
  const input = document.querySelector("#preferredDate");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  input.min = `${yyyy}-${mm}-${dd}`;
  input.value = input.min;
}

function setupBookingForm() {
  const form = document.querySelector("#bookingForm");
  const status = document.querySelector("#formStatus");

  form.addEventListener("change", estimateQuote);
  form.addEventListener("input", estimateQuote);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.services = selectedServiceIds();
    payload.estimate = estimateQuote();
    payload.createdAt = new Date().toISOString();

    const leads = JSON.parse(localStorage.getItem("safaibroLeads") || "[]");
    leads.unshift(payload);
    localStorage.setItem("safaibroLeads", JSON.stringify(leads.slice(0, 25)));

    status.textContent = "Booking request saved. SafaiBro support can now connect this form to your live backend.";
    form.reset();
    setMinDate();
    document.querySelector('input[name="services"][value="daily"]').checked = true;
    estimateQuote();
  });
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Unable to read image file")));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeAadhaar(value) {
  return value.replace(/\D/g, "").slice(0, 12);
}

function maskAadhaar(value) {
  const digits = normalizeAadhaar(value);
  return digits.length === 12 ? `XXXX XXXX ${digits.slice(-4)}` : "Incomplete Aadhaar";
}

function getRegistrations() {
  return JSON.parse(localStorage.getItem(registrationKey) || "[]");
}

function saveRegistrations(registrations) {
  localStorage.setItem(registrationKey, JSON.stringify(registrations));
}

function statusLabel(status) {
  const labels = {
    pending: "Pending approval",
    approved: "Approved",
    rejected: "Rejected",
  };

  return labels[status] || status;
}

function renderAdminList(filter = "all") {
  const list = document.querySelector("#adminList");
  const registrations = getRegistrations();
  const visible = filter === "all" ? registrations : registrations.filter((item) => item.status === filter);

  if (!visible.length) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>No registrations found</h3>
        <p>New staff registrations will appear here for admin approval.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = visible
    .map((item) => {
      const photo = escapeHtml(item.photo || "");
      const name = escapeHtml(item.name);
      const mobile = escapeHtml(item.mobile);
      const branch = escapeHtml(item.branch);
      const aadhaarMasked = escapeHtml(item.aadhaarMasked);
      const policeStatus = escapeHtml(item.policeStatus);
      const policeDocumentName = escapeHtml(item.policeDocumentName || "Not uploaded");
      const address = escapeHtml(item.address);
      const status = escapeHtml(item.status);
      const id = escapeHtml(item.id);

      return `
        <article class="admin-card">
          <img class="staff-photo" src="${photo}" alt="${name} staff photo">
          <div class="staff-info">
            <div class="staff-heading">
              <h3>${name}</h3>
              <span class="status-pill ${status}">${statusLabel(item.status)}</span>
            </div>
            <dl>
              <div><dt>Mobile</dt><dd>${mobile}</dd></div>
              <div><dt>Branch</dt><dd>${branch}</dd></div>
              <div><dt>Aadhaar</dt><dd>${aadhaarMasked}</dd></div>
              <div><dt>Police</dt><dd>${policeStatus}</dd></div>
              <div><dt>Document</dt><dd>${policeDocumentName}</dd></div>
              <div><dt>Address</dt><dd>${address}</dd></div>
            </dl>
            <div class="admin-actions">
              <button class="button approve" type="button" data-action="approved" data-id="${id}">Approve</button>
              <button class="button reject" type="button" data-action="rejected" data-id="${id}">Reject</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setupStaffRegistration() {
  const form = document.querySelector("#staffForm");
  const status = document.querySelector("#staffStatus");
  const aadhaar = form.elements.aadhaar;

  aadhaar.addEventListener("input", () => {
    const digits = normalizeAadhaar(aadhaar.value);
    aadhaar.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const aadhaarDigits = normalizeAadhaar(data.get("aadhaar") || "");

    if (aadhaarDigits.length !== 12) {
      status.textContent = "Please enter a valid 12 digit Aadhaar number.";
      return;
    }

    const photoFile = data.get("photo");
    const policeFile = data.get("policeDocument");

    if (!["image/jpeg", "image/png", "image/webp"].includes(photoFile.type)) {
      status.textContent = "Please upload a JPG, PNG, or WebP staff photo.";
      return;
    }

    const photo = await readImageFile(photoFile);
    const registrations = getRegistrations();

    registrations.unshift({
      id: `staff-${Date.now()}`,
      name: data.get("name"),
      mobile: data.get("mobile"),
      branch: data.get("branch"),
      aadhaarMasked: maskAadhaar(aadhaarDigits),
      policeStatus: data.get("policeStatus"),
      policeDocumentName: policeFile?.name || "",
      photo,
      address: data.get("address"),
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    saveRegistrations(registrations.slice(0, 40));
    form.reset();
    status.textContent = "Registration submitted. Admin can approve it below.";
    renderAdminList(document.querySelector(".filter-button.active")?.dataset.filter || "all");
  });
}

function setupAdminApproval() {
  const toolbar = document.querySelector(".admin-toolbar");
  const list = document.querySelector("#adminList");

  toolbar.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-button");

    if (!button) {
      return;
    }

    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderAdminList(button.dataset.filter);
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const registrations = getRegistrations().map((item) => {
      if (item.id !== button.dataset.id) {
        return item;
      }

      return {
        ...item,
        status: button.dataset.action,
        reviewedAt: new Date().toISOString(),
      };
    });

    saveRegistrations(registrations);
    renderAdminList(document.querySelector(".filter-button.active")?.dataset.filter || "all");
  });

  renderAdminList();
}

renderServices();
renderPlans();
setMinDate();
setupBookingForm();
setupStaffRegistration();
setupAdminApproval();
estimateQuote();
