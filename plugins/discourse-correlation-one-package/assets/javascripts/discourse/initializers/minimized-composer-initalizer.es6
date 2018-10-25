import { withPluginApi } from "discourse/lib/plugin-api";

function initializeMinimizedComposer(api) {
  
  // see app/assets/javascripts/discourse/lib/plugin-api
  // for the functions available via the api object
  
}

export default {
  name: "minimized-composer",

  initialize() {
  	alert('hello');
    withPluginApi("0.8.24", initializeMinimizedComposer);
  }
};
