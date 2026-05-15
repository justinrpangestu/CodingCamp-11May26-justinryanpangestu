# CodingCamp-11May26-justinryanpangestu

# Expense & Budget Visualizer 📊

A mobile-friendly web application designed to help users track their daily expenses, view real-time statistics, and manage budgets seamlessly. This application is built using pure Vanilla JavaScript without external frameworks, featuring persistent local data storage.

This project was developed as a milestone submission for ReVou.

## 🚀 Core Features (MVP)

- Transaction Input Form: Dynamic expense logging with robust, multi-layered validation (.trim() and isNaN()).
- Dynamic Transaction List: A smooth, scrollable history of your expenses with instant deletion capabilities, utilizing the Event Delegation technique to optimize performance.
- Persistent Storage (LocalStorage): Automatic JSON synchronization ensures your financial data is preserved even after refreshing the page or closing the browser.
- Standard Currency Formatting: Expense amounts are automatically formatted into Indonesian Rupiah (Rp 50.000) using the browser's native Intl.NumberFormat API.
- Interactive Visual Chart: Real-time data visualization powered by Chart.js displaying expenditure proportions per category. Features an automated cleanup routine (chart.destroy()) to prevent rendering glitches.

## 🌟 Advanced Features (Bonus Capabilities)

This application has been successfully enhanced with 3 advanced optional features:
1. 🏷️ Custom Categories: Users can add new expense categories freely. It implements a native JavaScript Set in the backend to ensure data merges without case-insensitive duplicates.
2. 🔄 Immutable Sorting: Provides sorting controls (Newest, Highest Amount, Lowest Amount, and Category A-Z) that organize the UI presentation seamlessly without mutating the original data order inside LocalStorage.
3. 🚨 Budget Limit Highlight: The total balance card dynamically tracks your specified financial threshold. If your total expenses exceed the defined budget limit, the UI automatically triggers an .over-limit state, changing the card gradient to a striking red warning color.

## 🛠️ Tech Stack

- Frontend: HTML5, CSS3 (Built with a Mobile-First Design approach, utilizing CSS Variables and the fluid clamp() function).
- Core Logic: Vanilla JavaScript (Structured around the Model-View-Controller / MVC Architectural Pattern).
- Third-Party Library: Chart.js (Integrated via CDN).

## 📁 Project Structure

project/
├── index.html          # Core layout & HTML structure
├── css/style.css       # Visual styles & mobile/desktop responsiveness
└── js/app.js           # Main application logic (Model, Validator, View, Controller)

## ⚙️ How to Run Locally

1. Clone this repository to your local machine.
2. Open the project folder using a code editor (e.g., VS Code).
3. Open index.html directly in your browser, or use the Live Server extension in VS Code for an optimal, auto-reloading development experience.