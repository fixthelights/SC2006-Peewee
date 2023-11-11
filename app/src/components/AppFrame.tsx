import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Toolbar,
  IconButton,
  Typography,
  List,
  Divider,
  Drawer,
  useMediaQuery,
  Box,
  Container,
  ContainerOwnProps,
  Menu,
  MenuItem,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  DashboardIcon,
  CarCrashOutlinedIcon,
  MapOutlinedIcon,
  TrafficOutlinedIcon,
} from "./AppFrameIndex";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Logout } from "@mui/icons-material";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface AppFrameProps extends ContainerOwnProps {
  defaultOpen?: boolean;
  pageName?: string;
  children?: React.ReactNode;
  style?: any;
}

export default function AppFrame({
  defaultOpen,
  pageName,
  children,
  style,
  ...props
}: AppFrameProps) {
  const [open, setOpen] = React.useState(true);
  const [openProfile, setOpenProfile] = React.useState(true);
  const [lastOpen, setLastOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isSmallScreen) {
      setLastOpen(open);
      setOpen(false);
    } else {
      setOpen(lastOpen);
    }
  }, [isSmallScreen]);

  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <React.Fragment>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/incidents")}>
          <ListItemIcon>
            <CarCrashOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Incidents" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/map")}>
          <ListItemIcon>
            <MapOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Map" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/roadconditions")}>
          <ListItemIcon>
            <TrafficOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Road Conditions" />
        </ListItemButton>
      </List>
    </React.Fragment>
  );

  const { maxWidth = "lg", sx = { mt: 4, mb: 4 } } = props;
  const trigger = useScrollTrigger();

  return (
    <Box sx={{ display: "flex"}}>
      <Slide appear={false} direction="down" in={!trigger}>
      <AppBar position={isSmallScreen ? "fixed" : "absolute"} open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: { sm: "none" } }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {!isSmallScreen && (
            <>
              <MapOutlinedIcon />
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
              >
                PEEWEE
              </Typography>
            </>
          )}
          <Container>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              align="center"
            >
              {pageName}
            </Typography>
          </Container>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleOutlinedIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      </Slide>
      {isSmallScreen ? (
        <Drawer
          variant="temporary"
          ModalProps={{
            keepMounted: true, 
          }}
          onClose={toggleDrawer}
          open={open}
        >
          {drawer}
        </Drawer>
      ) : (
        <StyledDrawer variant="permanent" open={open}>
          {drawer}
        </StyledDrawer>
      )}
      <Container
        maxWidth={maxWidth}
        sx={sx}
        style={style}
        {...props}
      >
        <Toolbar/>
        {children}
      </Container>
    </Box>
  );
}
