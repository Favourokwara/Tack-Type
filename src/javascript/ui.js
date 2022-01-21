class UI {
   createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const {left, top} = button.getBoundingClientRect()

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - left - radius}px`;
    circle.style.top = `${event.clientY - top - radius}px`;

    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  }
}

export { UI }; 