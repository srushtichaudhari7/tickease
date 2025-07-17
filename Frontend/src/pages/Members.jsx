import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../components/axiosInstance";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔄 Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/members");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  // 🆕 Add new member
  const handleMemberSubmit = async () => {
    if (!newMember.name || !newMember.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      const response = await axiosInstance.post("/members", newMember);
      setMembers([...members, response.data]);
      setIsModalOpen(false);
      setNewMember({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-white-800">Team Members</h1>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ Add Member
        </button>

        {/* Member List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member._id} className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-lg font-bold text-blue-700">{member.name}</h2>
              <p className="text-sm text-blue-500">{member.email}</p>
            </div>
          ))}
        </div>

        {/* Add Member Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                Add New Member
              </h2>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 mb-2 placeholder:text-gray-800 text-gray-900"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 mb-2 placeholder:text-gray-800 text-gray-900"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={handleMemberSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
