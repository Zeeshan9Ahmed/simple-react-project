import React from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Dashboard } from './SidebarIcons/Dashboard';
import { User } from './SidebarIcons/User';
import { AllUsers } from './SidebarIcons/AllUsers';
 import { Link, useLocation } from 'react-router-dom' 
import { Content } from './SidebarIcons/Content';
import { TermsAndConditions } from './SidebarIcons/TermsAndConditions';
import { PrivacyPolicy } from './SidebarIcons/PrivacyPolicy';
 import { Specie } from './SidebarIcons/Specie';
 const SidebarPro = () => {
    const location = useLocation()
    const active = {
        dashboard: location?.pathname == "/dashboard",

        userManagement: location?.pathname == "/user-list",
        userList: location?.pathname == "/user-list",
 
        eventManagement: location?.pathname == "/event-list" ,
        allEvents: location?.pathname == "/event-list"  ,
 

        contentManagement: location?.pathname == "/terms-and-conditions" || location.pathname == "/privacy-policy" || location.pathname == "/about-us",
        termsAndConditions: location?.pathname == "/terms-and-conditions",
        privacyPolicy: location?.pathname == "/privacy-policy", 
    }
    return (
        <div style={{ display: 'flex', height: '100wh', minHeight: '100vh' }}>
            <Sidebar image="https://i.pinimg.com/736x/8e/6c/06/8e6c064f57f94838263d7ba9ad80f353.jpg" rtl={false}
                breakPoint="lg"
                backgroundColor="#212529"
                rootStyles={{
                    color: "#8ba1b7",
                }}>
                <div className="sidebar-header">
                    <div className="logo text-center">
                        <Link to="/dashboard"><img src="/assets/images/logo1.png" style={{ width: "50%", borderRadius: 10 }} alt="logo" className="img-fluid my-3" /></Link>
                    </div>
                </div>
                <Menu menuItemStyles={{
                    root: {
                        fontSize: '13px',
                        fontWeight: 400,
                    },
                    button: ({ level, active, disabled, open }) => {
                        if (level === 0)
                            return {
                                color: disabled ? '#777777' : '#8ba1b7',
                                fontWeight: active ? '600' : "normal",
                                backgroundColor: active ? "#313131" : undefined,
                                color: open ? "#b6c8d9" : undefined,
                                '&:hover': {
                                    backgroundColor: "#313131",
                                    color: "#b6c8d9",
                                },
                            };
                    },
                    label: ({ open, active }) => ({
                        fontWeight: open || active ? 600 : undefined,
                    }),
                }} transitionDuration={500} >
                    <Link to="/dashboard" style={{ paddingLeft: 0, color: '#8ba1b7' }}>
                        <MenuItem active={active?.dashboard} icon={<Dashboard />}> Dashboard</MenuItem>
                    </Link>
                    <SubMenu SubMenuExpandIcon defaultOpen={active?.userManagement} active={active?.userManagement} icon={<User />} label="Users Management" >
                        <MenuItem component={<Link to="/user-list" />} active={active?.userList} icon={<AllUsers />} rootStyles={{
                            backgroundColor: active?.userList ? "rgba(0, 69, 139,1)" : '#1D454C',
                            fontSize: '15px',
                        }}> All Users </MenuItem>
                    </SubMenu> 
                    <SubMenu defaultOpen={active?.eventManagement} active={active?.eventManagement} icon={<Specie />} label="Events Management" >
                        <MenuItem component={<Link to="/event-list" />} active={active?.allEvents} icon={<Specie />} rootStyles={{
                            backgroundColor: active?.allEvents ? "rgba(0, 69, 139,1)" : '#1D454C',
                            fontSize: '15px',
                        }}> All Events </MenuItem>
                    </SubMenu> 
                    <SubMenu defaultOpen={active?.contentManagement} active={active?.contentManagement} icon={<Content />} label="Content Management" >
                        <MenuItem component={<Link to="/terms-and-conditions" />} active={active?.termsAndConditions} icon={<TermsAndConditions />} rootStyles={{
                            backgroundColor: active?.termsAndConditions ? "rgba(0, 69, 139,1)" : '#1D454C',
                            fontSize: '15px',
                        }}> Terms & Conditions </MenuItem>
                        <MenuItem component={<Link to="/privacy-policy" />} active={active?.privacyPolicy} icon={<PrivacyPolicy />} rootStyles={{
                            backgroundColor: active?.privacyPolicy ? "rgba(0, 69, 139,1)" : '#1D454C',
                            fontSize: '15px',
                        }}> Privacy Policy </MenuItem> 
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    )
}

export default SidebarPro