//This is a small utility function used to highlight the currently active route (e.g., in a navbar). It returns "active" if the given route matches the current route, otherwise an empty string.
//we will use this function in header.ejs file and app.js file
function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : "";
}

module.exports = { isActiveRoute };
