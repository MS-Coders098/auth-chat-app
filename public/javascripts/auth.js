function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const fieldType = field.getAttribute("type") === "password" ? "text" : "password";
    field.setAttribute("type", fieldType);
}