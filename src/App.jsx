import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home, Layout, List, ManageList, Err, Login } from './views';

import { PublicRoute, PrivateRoute, Spinner } from './components';

import { useAuth } from './api';

import { useShoppingListData, useShoppingLists } from './api';

import { useStateWithStorage } from './utils';

export function App() {
	/**
	 * This custom hook takes the path of a shopping list
	 * in our database and syncs it with localStorage for later use.
	 * Check ./utils/hooks.js for its implementation.
	 */
	const [listPath, setListPath] = useStateWithStorage(
		'tcl-shopping-list-path',
		null,
	);

	/**
	 * This custom hook holds info about the current signed in user.
	 * Check ./api/useAuth.jsx for its implementation.
	 */
	const { user } = useAuth();
	const userId = user?.uid;
	const userEmail = user?.email;

	/**
	 * This custom hook takes a user ID and email and fetches
	 * the shopping lists that the user has access to.
	 * Check ./api/firestore.js for its implementation.
	 */
	const lists = useShoppingLists(userId, userEmail);
	/**
	 * This custom hook takes our token and fetches the data for our list.
	 * Check ./api/firestore.js for its implementation.
	 */
	const { data, loading, setLoading } = useShoppingListData(listPath);

	if (loading) {
		return <Spinner />;
	}
	return (
		<Router>
			<Routes>
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<Login />} />
				</Route>
				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Layout />}>
						<Route
							index
							element={
								<Home
									data={lists}
									setListPath={setListPath}
									setLoading={setLoading}
								/>
							}
						/>
						<Route
							path="/list"
							element={
								<List
									data={data}
									listPath={listPath}
									loading={loading}
									setLoading={setLoading}
								/>
							}
						/>
						<Route
							path="/manage-list"
							element={<ManageList listPath={listPath} data={data} />}
						/>
					</Route>
				</Route>
				<Route path="*" element={<Err />} />
			</Routes>
		</Router>
	);
}
