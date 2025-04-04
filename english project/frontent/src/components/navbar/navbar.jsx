// import { Avatar, Tooltip, UnstyledButton, Center, Stack } from "@mantine/core";
// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import {
//   IconHome2,
//   IconGauge,
//   IconUser,
//   IconSettings,
//   IconSwitchHorizontal,
//   IconLogout,
// } from "@tabler/icons-react";

// import "./navBar.css";


// function NavbarLink({ icon: Icon, label, active, to, onClick }) {
//   return (
//     <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
//       <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
//         <Link to={to} className="nav-link">
//           <Icon size={20} stroke={1.5} />
//         </Link>
//       </UnstyledButton>
//     </Tooltip>
//   );
// }

// const mockdata = [
//   { icon: IconHome2, label: "Home", to: "/" },
//   { icon: IconGauge, label: "Dashboard", to: "/dashboard" },
//   { icon: IconUser, label: "Account", to: "/profile" },
//   { icon: IconSettings, label: "Settings", to: "/settings" },
// ];

// export default function NavBar() {
//   const location = useLocation();
//   const [active, setActive] = useState(0);

//   const links = mockdata.map((link, index) => (
//     <NavbarLink
//       {...link}
//       key={link.label}
//       active={location.pathname === link.to}
//       onClick={() => setActive(index)}
//     />
//   ));

//   return (
//     <div className="header">
//       <nav className="navbar">
//         <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
//         <Link to="/reading" className={location.pathname === "/reading" ? "active" : ""}>Reading</Link>
//         <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
//       </nav>

//       <nav className={classes.navbar}>
//         <Center>
         
//         </Center>
//         <div className={classes.navbarMain}>
//           <Stack justify="center" gap={0}>{links}</Stack>
//         </div>
//         <Stack justify="center" gap={0}>
//           <NavbarLink icon={IconSwitchHorizontal} label="Change account" to="#" />
//           <NavbarLink icon={IconLogout} label="Logout" to="#" />
//         </Stack>
//       </nav>

//       <div className="profile-button">
//         <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
//           <Avatar
//             src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
//             size={36}
//             radius={80}
//           />
//         </Link>
//       </div>
//     </div>
//   );
// }































































import { Avatar } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./navBar.css";

function NavBar() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Token mavjudligini tekshirish
  );

  return (
    <div className="header">
      <nav className="navbar">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>

        {!isAuthenticated && (
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
            Login
          </Link>
        )}
      </nav>

      {isAuthenticated && (
        <div className="profile-button">
          <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
              size={36}
              radius={80}
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavBar;
