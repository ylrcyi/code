document.addEventListener('DOMContentLoaded', () => {
  // Extract the team number from the URL
  const pathSegments = window.location.pathname.split('/');
  const teamNumber = pathSegments[pathSegments.length - 1];

  // Update the header with the team number
  const header = document.getElementById('team-header');
  header.textContent = `Team ${teamNumber}`;
});
