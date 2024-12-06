import SideBarLeft from "../sidebarLeft/SideBarLeft";
import './StyleAdminScreen.css';

export default function AdminScreen(){
    return (
        <div className="mainContainer">
            <SideBarLeft className="sidebarLeft" />
        </div>
    );
}
