import { useState } from "react";
import TaskTable from "../components/TaskTable";
import TaskKanban from "../components/TaskKanban";
import TaskCalendar from "../components/TaskCalendar";

const MyTasks = () => {
    const [view, setView] = useState("table");

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-gray-500">View all your tasks here</p>

            {/* View Switcher */}
            <div className="flex space-x-4 mt-4">
                <button className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-gray-100"}`} onClick={() => setView("table")}>Table</button>
                <button className={`px-4 py-2 ${view === "kanban" ? "bg-gray-300" : "bg-gray-100"}`} onClick={() => setView("kanban")}>Kanban</button>
                <button className={`px-4 py-2 ${view === "calendar" ? "bg-gray-300" : "bg-gray-100"}`} onClick={() => setView("calendar")}>Calendar</button>
            </div>

            {/* Render View */}
            {view === "table" && <TaskTable />}
            {view === "kanban" && <TaskKanban />}
            {view === "calendar" && <TaskCalendar />}
        </div>
    );
};

export default MyTasks;
