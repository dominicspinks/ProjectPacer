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
		<Menu placement='right-start'>
			{menuItems && menuItems.length > 0 && (
				<>
					<MenuHandler>
						<Button className='m-0 p-0'>
							<MenuIcon />
						</Button>
					</MenuHandler>
					<MenuList className='bg-slate-500 border-none rounded-lg text-white'>
						{menuItems.map((item) => (
							<MenuItem
								key={item.name}
								className='bg-transparent p-2 hover:bg-slate-400 hover:text-grey-600 rounded'
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
