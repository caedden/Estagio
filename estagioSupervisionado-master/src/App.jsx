import AdminScreen from "./components/administratorComponents/AdminScreen/adminScreen";
import SideBarLeft from "./components/administratorComponents/sidebarLeft/SideBarLeft";
import LoginScreen from "./components/componentsForAll/Login/LoginScreen";
import Menu from "./components/userComponents/Body/Menu";
import NavBar from "./components/userComponents/Header/NavBar";
import RegistrationScreen from "./components/userComponents/registrationScreeen/registrationScreen";

export default function App(){
  return(
    <div className="Container">
      <AdminScreen />
    </div>
  )
}