/**
 * Contact Form Handler
 * Handles form submission, validation, and user feedback
 * All utility functions included in this file
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * EmailJS Configuration
 * @type {Object}
 */
const EMAILJS_CONFIG = {
  // Public key - in production, use environment variable
  PUBLIC_KEY: "KK0TiUAMfr7fRo_Jy",
  SERVICE_ID: "default_service",
  TEMPLATE_ID: "template_0oigv73",
};

/**
 * Form button states
 * @type {Object}
 */
const FORM_STATES = {
  IDLE: "Enviar",
  SENDING: "Enviando...",
  SUCCESS: "Enviado",
  ERROR: "Error",
};

/**
 * Form validation messages
 * @type {Object}
 */
const FORM_MESSAGES = {
  REQUIRED_FIELD: "Este campo es obligatorio",
  INVALID_EMAIL: "Por favor, ingresa un email válido",
  INVALID_PHONE: "El teléfono debe tener 10 dígitos",
  INVALID_MESSAGE: "El mensaje es obligatorio",
  CONSENT_REQUIRED: "Debes autorizar el tratamiento de datos",
  SUBMIT_ERROR: "Error al enviar el mensaje. Por favor, inténtalo más tarde.",
  CONNECTION_ERROR: "Error de conexión. Verifica tu conexión a internet.",
  SUCCESS: "¡Mensaje enviado correctamente!",
};

// ============================================================================
// LOGGER UTILITY
// ============================================================================

/**
 * Check if we're in development mode
 * @returns {boolean}
 */
const isDevelopment = () => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("dev")
  );
};

/**
 * Logger utility for development and production
 */
const logger = {
  /**
   * Log error messages
   * @param {...any} args - Arguments to log
   */
  error(...args) {
    if (isDevelopment()) {
      console.error(...args);
    }
  },

  /**
   * Log warning messages
   * @param {...any} args - Arguments to log
   */
  warn(...args) {
    if (isDevelopment()) {
      console.warn(...args);
    }
  },

  /**
   * Log info messages
   * @param {...any} args - Arguments to log
   */
  log(...args) {
    if (isDevelopment()) {
      console.log(...args);
    }
  },
};

// ============================================================================
// FORM VALIDATION UTILITIES
// ============================================================================

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (10 digits)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validates a form field
 * @param {HTMLInputElement|HTMLTextAreaElement} field - Field to validate
 * @returns {{valid: boolean, message: string}} Validation result
 */
function validateSingleField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const fieldType = field.type;

  // Check required
  if (field.required && !value) {
    return {
      valid: false,
      message: "Este campo es obligatorio",
    };
  }

  // Type-specific validation
  if (value) {
    if (fieldType === "email" && !isValidEmail(value)) {
      return {
        valid: false,
        message: "Por favor, ingresa un email válido",
      };
    }

    if (fieldType === "tel" && !isValidPhone(value)) {
      return {
        valid: false,
        message: "El teléfono debe tener 10 dígitos",
      };
    }

    if (fieldName === "Mensaje" && value.length < 10) {
      return {
        valid: false,
        message: "El mensaje debe tener al menos 10 caracteres",
      };
    }
  }

  return { valid: true, message: "" };
}

/**
 * Validates entire form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {{valid: boolean, errors: Object}} Validation result
 */
function validateForm(form) {
  const errors = {};
  let isValid = true;

  const fields = form.querySelectorAll("input[required], textarea[required]");

  fields.forEach((field) => {
    const validation = validateSingleField(field);
    if (!validation.valid) {
      isValid = false;
      errors[field.name] = validation.message;
    }
  });

  // Check consent checkbox
  const consentCheckbox = form.querySelector("#datos-consent");
  if (consentCheckbox && consentCheckbox.required && !consentCheckbox.checked) {
    isValid = false;
    errors["datos-consent"] = "Debes autorizar el tratamiento de datos";
  }

  return { valid: isValid, errors };
}

// ============================================================================
// MODAL UTILITY
// ============================================================================

/**
 * Modal controller
 */
const Modal = {
  /**
   * Opens the success modal
   */
  open() {
    const modal = document.getElementById("successModal");
    if (!modal) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Success modal not found");
      }
      return;
    }

    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");

    // Focus management for accessibility
    const closeButton = modal.querySelector(".close");
    if (closeButton) {
      setTimeout(() => closeButton.focus(), 100);
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Trap focus within modal
    this.trapFocus(modal);
  },

  /**
   * Closes the modal
   */
  close() {
    const modal = document.getElementById("successModal");
    if (!modal) return;

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    // Restore body scroll
    document.body.style.overflow = "";

    // Remove focus trap
    this.removeFocusTrap();
  },

  /**
   * Traps focus within the modal for accessibility
   * @param {HTMLElement} modal - Modal element
   */
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this._focusTrapHandler = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener("keydown", this._focusTrapHandler);
  },

  /**
   * Removes focus trap
   */
  removeFocusTrap() {
    const modal = document.getElementById("successModal");
    if (modal && this._focusTrapHandler) {
      modal.removeEventListener("keydown", this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
  },

  /**
   * Initializes modal event listeners
   */
  init() {
    const modal = document.getElementById("successModal");
    if (!modal) return;

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        this.close();
      }
    });
  },
};

// ============================================================================
// CONTACT FORM CONTROLLER
// ============================================================================

/**
 * Contact Form Controller
 */
const ContactForm = {
  /**
   * Initializes the contact form
   */
  init() {
    // Wait for EmailJS to be available (it loads with defer)
    const initEmailJS = () => {
      if (typeof emailjs === "undefined") {
        // Retry after a short delay
        setTimeout(initEmailJS, 100);
        return;
      }

      // Initialize EmailJS
      try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        logger.log("EmailJS initialized successfully");
      } catch (error) {
        logger.error("Error initializing EmailJS:", error);
        this.showErrorMessage(FORM_MESSAGES.CONNECTION_ERROR);
        return;
      }

      // Setup form
      this.setupForm();
    };

    // Start initialization
    initEmailJS();

    // Setup modal (doesn't depend on EmailJS)
    Modal.init();
  },

  /**
   * Sets up form event listeners
   */
  setupForm() {
    const form = document.querySelector("#contact-form");
    if (!form) {
      logger.warn("Contact form not found");
      return;
    }

    // Submit handler
    form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Real-time validation on blur
    const fields = form.querySelectorAll("input, textarea");
    fields.forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });

    // Checkbox validation
    const consentCheckbox = form.querySelector("#datos-consent");
    if (consentCheckbox) {
      consentCheckbox.addEventListener("change", () => {
        this.clearFieldError(consentCheckbox);
      });
    }
  },

  /**
   * Handles form submission
   * @param {Event} event - Submit event
   */
  async handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const btn = document.getElementById("button");

    if (!form || !btn) {
      logger.error("Form or button not found");
      return;
    }

    // Validate form
    const validation = validateForm(form);
    if (!validation.valid) {
      this.showFieldErrors(validation.errors);
      this.focusFirstError(form);
      return;
    }

    // Clear previous errors
    this.clearAllErrors(form);

    // Disable form during submission
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = FORM_STATES.SENDING;
    form.setAttribute("aria-busy", "true");

    try {
      // Submit form
      await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        form
      );

      // Success
      btn.textContent = FORM_STATES.SUCCESS;
      form.reset();
      this.clearAllErrors(form);
      Modal.open();

      // Reset button after delay
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 2000);
    } catch (error) {
      // Handle error
      this.handleFormError(error, btn, originalText);
    } finally {
      form.removeAttribute("aria-busy");
    }
  },

  /**
   * Handles form submission errors
   * @param {Error} error - Error object
   * @param {HTMLButtonElement} btn - Submit button
   * @param {string} originalText - Original button text
   */
  handleFormError(error, btn, originalText) {
    btn.disabled = false;
    btn.textContent = originalText;

    // Determine error message
    let errorMessage = FORM_MESSAGES.SUBMIT_ERROR;

    if (error.status === 0 || !navigator.onLine) {
      errorMessage = FORM_MESSAGES.CONNECTION_ERROR;
    }

    // Show error to user
    this.showErrorMessage(errorMessage);

    // Log for debugging
    logger.error("Form submission error:", error);
  },

  /**
   * Validates a single field
   * @param {HTMLInputElement|HTMLTextAreaElement} field - Field to validate
   */
  validateField(field) {
    const validation = validateSingleField(field);
    const errorElement = document.getElementById(`${field.id}-error`);

    if (!validation.valid) {
      field.setAttribute("aria-invalid", "true");
      if (errorElement) {
        errorElement.textContent = validation.message;
        errorElement.classList.remove("sr-only");
      }
    } else {
      field.setAttribute("aria-invalid", "false");
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.add("sr-only");
      }
    }
  },

  /**
   * Clears error for a specific field
   * @param {HTMLInputElement|HTMLTextAreaElement} field - Field to clear
   */
  clearFieldError(field) {
    field.setAttribute("aria-invalid", "false");
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.add("sr-only");
    }
  },

  /**
   * Shows field-specific errors
   * @param {Object} errors - Object with field names as keys and error messages as values
   */
  showFieldErrors(errors) {
    Object.keys(errors).forEach((fieldName) => {
      let field;

      // Map field names to IDs
      const fieldIdMap = {
        Nombre: "nombre",
        Email: "email",
        Telefono: "telefono",
        Mensaje: "mensaje",
        "datos-consent": "datos-consent",
      };

      const fieldId = fieldIdMap[fieldName] || fieldName.toLowerCase();
      field = document.getElementById(fieldId);

      if (field) {
        field.setAttribute("aria-invalid", "true");
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
          errorElement.textContent = errors[fieldName];
          errorElement.classList.remove("sr-only");
        }
      }
    });
  },

  /**
   * Clears all form errors
   * @param {HTMLFormElement} form - Form element
   */
  clearAllErrors(form) {
    const fields = form.querySelectorAll("input, textarea");
    fields.forEach((field) => {
      field.setAttribute("aria-invalid", "false");
      const errorElement = document.getElementById(`${field.id}-error`);
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.add("sr-only");
      }
    });

    // Clear general error message
    const formErrors = document.getElementById("form-errors");
    if (formErrors) {
      formErrors.textContent = "";
      formErrors.classList.add("sr-only");
    }
  },

  /**
   * Shows a general error message
   * @param {string} message - Error message
   */
  showErrorMessage(message) {
    const formErrors = document.getElementById("form-errors");
    if (formErrors) {
      formErrors.textContent = message;
      formErrors.classList.remove("sr-only");
      formErrors.setAttribute("role", "alert");
    }
  },

  /**
   * Focuses the first field with an error
   * @param {HTMLFormElement} form - Form element
   */
  focusFirstError(form) {
    const firstError = form.querySelector('[aria-invalid="true"]');
    if (firstError) {
      firstError.focus();
    }
  },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Expose closeModal globally for onclick handler
window.closeModal = () => Modal.close();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ContactForm.init());
} else {
  ContactForm.init();
}
