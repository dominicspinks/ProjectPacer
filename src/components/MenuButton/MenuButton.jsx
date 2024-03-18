import {
	Menu,
	MenuHandler,
	MenuList,
	MenuItem,
	Button,
} from '@material-tailwind/react';

// Components
import MenuIcon from '../MenuIcon/MenuIcon';

export default function MenuDefault({ menuItems }) {
	return (
		<Menu>
			{menuItems && menuItems.length > 0 && (
				<>
					<MenuHandler>
						<Button className='m-0 p-2'>
							<MenuIcon />
						</Button>
					</MenuHandler>
					<MenuList className='bg-slate-800 p-2'>
						{menuItems.map((item) => (
							<MenuItem
								key={item.name}
								className='bg-slate-500 p-2 hover:bg-slate-400'
								onClick={item.onClick}>
								{item.name}
							</MenuItem>
						))}
					</MenuList>
				</>
			)}
		</Menu>
	);
}
