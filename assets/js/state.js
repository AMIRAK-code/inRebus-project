// Initial data structure
const defaultState = {
    targetRole: "",
    matchPercentage: 0,
    skills: [],
    gaps: [],
    recommendations: [],
    activeTab: 'dashboard',
    isLoading: false
};

// Load existing data from LocalStorage or use defaults
const savedData = JSON.parse(localStorage.getItem('inrebus_session')) || defaultState;

// The "Reactive" State
const STATE = new Proxy(savedData, {
    set(target, prop, value) {
        target[prop] = value;
        
        // Every time a piece of data changes, save it and update the UI
        localStorage.setItem('inrebus_session', JSON.stringify(target));
        
        // Trigger UI updates automatically
        if (typeof App !== 'undefined' && App.render) {
            App.render();
        }
        return true;
    }
});