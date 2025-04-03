const TaskKanban = () => {
    return (
        <div className="grid grid-cols-5 gap-4 mt-4">
            {["Backlog", "To Do", "In Progress", "In Review", "Done"].map(status => (
                <div key={status} className=" p-4 rounded-lg">
                    <h3 className="font-bold">{status}</h3>
                    <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">+ Add</button>
                </div>
            ))}
        </div>
    );
};

export default TaskKanban;
