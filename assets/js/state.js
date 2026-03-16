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


const savedData = JSON.parse(localStorage.getItem('inrebus_session')) || defaultState;


const STATE = new Proxy(savedData, {
    set(target, prop, value) {
        target[prop] = value;
        

        localStorage.setItem('inrebus_session', JSON.stringify(target));
        

        if (typeof App !== 'undefined' && App.render) {
            App.render();
        }
        return true;
    }
});