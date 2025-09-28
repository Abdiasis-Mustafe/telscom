import  { useEffect, useState } from 'react';
import { IoIosNotifications, } from 'react-icons/io';

import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { BiSolidDoorOpen } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { logout } from '@/Redux/Slice/userinfo';
import { useNavigate } from 'react-router-dom';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

function Nav() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.add(savedTheme);
    } else {
      setTheme('light');
      document.body.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    window.location.reload();
  };

  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className="flex gap-2 items-center">
        {/* <div className="relative">
          <input
            type="search"
            placeholder="search"
            className="pl-8 min-w-[300px] dark:bg-[#dddddd] hidden sm:block lg:w-[700px] p-2 rounded-xl w-[60%]"
          />
          <IoSearch className="absolute top-1/3 left-2 hidden sm:block text-gray-500" />
        </div> */}
        <div className="flex items-center gap-2">
          <FormGroup>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
              }
              label="Theme mode"
            />
          </FormGroup>
          <IoIosNotifications className="text-2xl" />
          {userInfo && (
            <>
              <div className="bg-teal-500 p-2 rounded-3xl">
                <p className="text-2xl">
                  {userInfo.full_name ? userInfo.full_name[0].toUpperCase() : ''}
                </p>
              </div>
              <h2 className="font-semibold hidden md:block">
                {userInfo.full_name ? capitalizeFirstLetter(userInfo.full_name) : ''}
              </h2>
              <button
                className="flex justify-between items-center ml-2 hover:bg-red-400 rounded-xl p-2"
                onClick={logoutHandler}
              >
                <BiSolidDoorOpen />logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
