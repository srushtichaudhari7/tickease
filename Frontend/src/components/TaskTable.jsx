const TaskTable = ({ tasks }) => {
    return (
        <div className="bg-grey-50 p-6 mt-4 shadow-lg rounded-lg">
            {/* Filters */}
            <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 border rounded">All Statuses ⬇️</button>
                <button className="px-4 py-2 border rounded">All Assignees ⬇️</button>
                <button className="px-4 py-2 border rounded">Due Date 📅</button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr >
                        <th className="p-2 border">Task Name</th>
                        <th className="p-2 border">Project</th>
                        <th className="p-2 border">Assignee</th>
                        <th className="p-2 border">Due Date</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task._id || index} className="text-center">
                            <td className="p-2 border">{task.title}</td>
                            <td className="p-2 border">{task.project?.name || "N/A"}</td>
                            <td className="p-2 border">{task.assignee?.name || "N/A"}</td>
                            <td className="p-2 border">{task.dueDate?.split("T")[0]}</td>
                            <td className="p-2 border bg-green-200">{task.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
