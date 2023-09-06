import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
} from '@mui/material';
import React, { useState } from 'react';
import AppBarComponent from '../components/common/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArticleIcon from '@mui/icons-material/Article';
import MuiDrawer from '@mui/material/Drawer';
import { NavLink, Outlet } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CalculateIcon, CompareIcon, ScienceIcon } from '../assets/icons';

const drawerWidth = 260;

const listMenuItem = [
  {
    pathName: '/dashboard/data-master',
    title: 'Data Master',
    icon: <ArticleIcon />,
    subMenu: [
      {
        pathName: '/dashboard/kriteria',
        title: 'Kriteria',
        icon: <ChecklistIcon />,
      },
      {
        pathName: '/dashboard/alternatif',
        title: 'Alternatif',
        icon: <ViewListIcon />,
      },
    ],
  },
  {
    pathName: '/dashboard/ahp',
    title: 'AHP',
    icon: <ArticleIcon />,
    subMenu: [
      {
        pathName: '/dashboard/ahp/nilaikriteriaahp',
        title: 'Perbandingan Kriteria',
        icon: <ChecklistIcon />,
      },
      {
        pathName: '/dashboard/ahp/nilaiahp',
        title: 'Perbandingan Alt',
        icon: <ChecklistIcon />,
      },
      {
        pathName: '/dashboard/ahp/hitung',
        title: 'Perhitungan AHP',
        icon: <CalculateIcon />,
      },
    ],
  },
  {
    pathName: '/dashboard/topsis',
    title: 'Topsis',
    icon: <CalculateIcon />,
    subMenu: [],
  },
  {
    pathName: '/dashboard/saw',
    title: 'SAW',
    icon: <CalculateIcon />,
    subMenu: [],
  },
  {
    pathName: '/dashboard/mopa',
    title: 'MOPA',
    icon: <ArticleIcon />,
    subMenu: [
      {
        pathName: '/dashboard/mopa/nilaimopa',
        title: 'Nilai Perbandingan',
        icon: <ChecklistIcon />,
      },
      {
        pathName: '/dashboard/mopa/hitung',
        title: 'Perhitungan Mopa',
        icon: <CalculateIcon />,
      },
    ],
  },
  {
    pathName: '/dashboard/perbandingan',
    title: 'Perbandingan',
    icon: <CompareIcon />,
    subMenu: [],
  },
  // {
  //   pathName: "/dashboard/anova",
  //   title: "Uji Anova",
  //   icon: <ScienceIcon />,
  //   subMenu: [],
  // },
];

const MenuItem = ({
  pathName,
  title,
  icon,
  subMenu,
  open,
  path,
  isDisabledNav,
}) => (
  <Accordion
    disableGutters={isDisabledNav}
    sx={{
      boxShadow: 'none',
      background: 'transparent',
      border: 'none',
      '& .Mui-disabled': {
        color: 'red',
      },
    }}
  >
    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
      <NavLink
        to={path}
        style={({ isActive }) => {
          return {
            color: !isActive ? '#000' : '#FFF',
            textDecoration: 'none',
            px: 2.5,
            width: '100%',
          };
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {icon}
          <Typography sx={{ display: open ? '' : 'none' }}>{title}</Typography>
        </Box>
      </NavLink>
    </AccordionSummary>
    <AccordionDetails sx={{ mt: -2 }}>
      {subMenu.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {subMenu.map((item, idx) => (
            <NavLink
              key={idx}
              style={({ isActive }) => {
                return {
                  color: isActive ? '#000' : '#FFF',
                  background: isActive ? '#FFF' : '',
                  minHeight: '36px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  paddingLeft: open && '36px',
                  justifyContent: !open && 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                };
              }}
              to={item.pathName}
            >
              {item.icon}
              <Typography sx={{ display: !open && 'none' }}>
                {item.title}
              </Typography>
            </NavLink>
          ))}
        </Box>
      )}
    </AccordionDetails>
  </Accordion>
);

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          open={open}
          menu={menu}
          sx={{ background: '#B31312' }}
        >
          <DrawerHeader>
            {open ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: drawerWidth,
                  pl: 2.5,
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{ fontSize: '24px', fontWeight: 600, color: '#FFF' }}
                >
                  <NavLink
                    to="/dashboard"
                    style={{ textDecoration: 'none', color: '#FFF' }}
                  >
                    MCDA
                  </NavLink>
                </Typography>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon sx={{ color: '#FFF' }} />
                </IconButton>
              </Box>
            ) : (
              <IconButton onClick={handleDrawerOpen}>
                <MenuIcon sx={{ color: '#FFF' }} />
              </IconButton>
            )}
          </DrawerHeader>
          {/* <Divider /> */}

          {listMenuItem.map((item) => (
            <MenuItem
              key={item.pathName}
              {...item}
              open={open}
              path={item?.subMenu.length === 0 && item.pathName}
              isDisabledNav={item?.subMenu.length === 0 ? true : false}
            />
          ))}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <AppBarComponent {...{ open, setOpen }} />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, menu }) => ({
  width: drawerWidth,
  flexShrink: 0,
  p: 0,
  background: menu === 'kriteria' ? '#FFF' : '#B31312',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('Box')(({ theme, menu }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  background: menu === 'kriteria' ? '#FFF' : '#B31312',
  padding: theme.spacing(0, 1),
  p: 0,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme, menu) => ({
  width: drawerWidth,
  background: menu === 'kriteria' ? '#FFF' : '#B31312',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  p: 0,
});

const closedMixin = (theme, menu) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  background: menu === 'kriteria' ? '#FFF' : '#B31312',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  p: 0,
});
