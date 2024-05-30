import "../../App.css";

// Custom Friend component
const Friend = ({ name, profilePic }) => (
  <div className="flex items-center mt-2">
    <img src={profilePic} alt={name} className="w-10 h-10 rounded-full" />
    <span className="ml-2 text-sm text-gray-700">{name}</span>
  </div>
);

function Sidebar({ selectedTags, toggleTag }) {
  const tags = ["BudgetFriendly", "Service", "Personal", "Work", "HiddenGem", "Review", "Student", "Food", "Travel"];


  const friends = [
    { name: "Lorray Doe", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBBqBpcE7FtHnFR8dtrRG1zQCed8TefPlIvA&usqp=CAU" },
    { name: "John Smith", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREO17hg6KvLlweeZWN0LCEdi-OXM9qGpbQ9w&usqp=CAU" },
    { name: "Alice Johnson", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNEVETHpIiIQzBUJowNKhHXlb8YGs98Qx1Aw&usqp=CAU" },
    { name: "Andrei Gorgan", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR11kyaqIfGjEp-a9kIuMhj4kAuNVUc_Xx_Nw&usqp=CAU" },
    { name: "Ray Carlos", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1-qhn6EXFBqptExJB5AOIlXNHTEwm-G83Dw&usqp=CAU" },
    { name: "Jerry Larry", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLwj_9hYtLdTHzuXSiQ7UpM708zgfzb-oE0A&usqp=CAU" },
    { name: "Samantha Chloe", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1ZWY3s2EIpIEFITwowrsSIY9yQj63CN-xg&usqp=CAU" },
    { name: "Kobe Ron", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT02wKmNIQid8_OsGX8O5YdXkTsjAhAn5Fetg&usqp=CAU" },
    { name: "Rosey Michael", profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRefA1omoLcZhwQMJkmVviwfU2lXhCZL3sXGA&usqp=CAU" },
  ];

  return (
    <div className="w-full bg-white shadow rounded-lg p-2 pt-1">
      <div className="text-center">
        <div className="text-center">
          <ul className="mt-2 space-y-1 flex gap-1 flex-wrap">
              {tags.map(tag => (
                  <li key={tag}
                      className={`rounded-full cursor-pointer px-4 py-2 inline-block w-lg max-w-xs ${selectedTags.includes(tag) ? 'bg-green-600 text-white' : 'bg-green-400 text-white hover:bg-green-500'}`}
                      onClick={() => toggleTag(tag)}>
                      {tag}
                  </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 ps-4">
        <h3 className="font-semibold text-gray-700 flex justify-center">Active Friends (8)</h3>
        <hr />
        {friends.map((friend, index) => (
          <Friend key={`${friend.name}-${index}`} name={friend.name} profilePic={friend.profilePic}/>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
