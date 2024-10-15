document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const nutritionForm = document.getElementById("nutrition-form");
    const selectedDateText = document.getElementById("selected-date");
    const saveButton = document.getElementById("save-button");
    const currentMonthYear = document.getElementById("current-month-year");

    // Month navigation buttons
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    // Function to save logs in localStorage
    function saveLogsToStorage(logs) {
        localStorage.setItem('nutritionLogs', JSON.stringify(logs));
    }

    // Function to load logs from localStorage
    function loadLogsFromStorage() {
        const storedLogs = localStorage.getItem('nutritionLogs');
        return storedLogs ? JSON.parse(storedLogs) : {};
    }

    // Load logs from localStorage
    const logs = loadLogsFromStorage();

    // Set nutrition goals (calories and protein)
    const calorieGoal = 2100;
    const proteinGoal = 155;
    const maintenanceCalories = 2550;
    const point7protein = 126;

    let selectedDayElement = null;
    let currentDate = new Date();

    // Function to get the number of days in a month
    function daysInMonth(month, year) 
    {
        return new Date(year, month + 1, 0).getDate();
    }

    function generateCalendar(month, year) {
        calendar.innerHTML = '';  // Clear previous calendar cells
        const days = daysInMonth(month, year);
        currentMonthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        
        for (let day = 1; day <= days; day++) {
            const dateCell = document.createElement("div");
            dateCell.classList.add("date-cell");
            dateCell.textContent = day;

            // Format the date as a string for logging purposes
            const dateKey = new Date(year, month, day).toLocaleDateString();

            // Check if there are logs for this date and update the color
            if (logs[dateKey] && logs[dateKey].calories >= calorieGoal && logs[dateKey].protein >= proteinGoal) {
                dateCell.style.backgroundColor = 'green';
            }
            else if((logs[dateKey].calories > calorieGoal && logs[dateKey].calories < maintenanceCalories) ||
            (logs[dateKey].protein >= point7protein && logs[dateKey].protein < proteinGoal ))
            {
               dateCell.style.backgroundColor = 'yellow'; // Set to yellow if daily intake is alright
            }
            else 
            {
               dateCell.style.backgroundColor = 'red'; // Set to red if daily intake is way off
            }


            // Attach event listener to each date cell
            dateCell.addEventListener("click", function () {
                showForm(day, dateCell, month, year);
            });

            calendar.appendChild(dateCell);
        }
    }

    // Show the form with the selected date
    function showForm(day, dateElement, month, year)
    {
        selectedDateText.textContent = `Date: ${new Date(year, month, day).toLocaleDateString()}`;
        nutritionForm.classList.remove("hidden");
        selectedDayElement = dateElement;
    }

    // Handle form submission
    saveButton.addEventListener("click", function () {
        const calories = document.getElementById("calories").value;
        const protein = document.getElementById("protein").value;

        if (calories && protein) 
        {
            const selectedDate = selectedDateText.textContent;
            logs[selectedDate] = { calories: parseInt(calories), protein: parseInt(protein) };

            saveLogsToStorage(logs);
            // Check if the goals are met
            if (logs[selectedDate].calories <= calorieGoal && logs[selectedDate].protein >= proteinGoal) 
            {
                selectedDayElement.style.backgroundColor = 'green'; // Set to green if daily intake is almost perfect
            } 
            else if((logs[selectedDate].calories > calorieGoal && logs[selectedDate].calories < maintenanceCalories) ||
             (logs[selectedDate].protein >= point7protein && logs[selectedDate].protein < proteinGoal ))
            {
                selectedDayElement.style.backgroundColor = 'yellow'; // Set to yellow if daily intake is alright
            }
            else 
            {
                selectedDayElement.style.backgroundColor = 'red'; // Set to red if daily intake is way off
            }

            // Clear the form
            document.getElementById("calories").value = "";
            document.getElementById("protein").value = "";
            nutritionForm.classList.add("hidden");
        } 
        else 
        {
            alert("Please enter both calories and protein.");
        }
    });


    prevMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    nextMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Initialize the calendar
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
});
