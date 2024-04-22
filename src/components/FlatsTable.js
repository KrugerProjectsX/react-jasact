// FlatsTable.js
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { useEffect, useState } from "react";
import { getDocs, query, where, collection, addDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, TextField } from "@mui/material";
import { Delete, Edit, Visibility, Favorite, FavoriteBorder } from "@mui/icons-material"; 

export default function FlatsTable({ type }) {
    const ref = collection(db, "flats");
    const refFav = collection(db, "favorites");

    const userId = JSON.parse(localStorage.getItem('user_logged'));
    const [flats, setFlats] = useState([]);
    const [filteredFlats, setFilteredFlats] = useState([]);
    const [flag, setFlag] = useState(false);
    const [filters, setFilters] = useState({
        city: "",
        minAreaSize: "",
        maxAreaSize: "",
        minRentPrice: "",
        maxRentPrice: ""
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const getData = async () => {
        if (type === 'my-flats') {
            const search = query(ref, where("user", "==", userId));
            const data = await getDocs(search);
            const rows = data.docs.map((item) => {
                return { ...item.data(), id: item.id }
            });

            setFlats(rows);
        }
        if (type === 'all-flats') {
            const data = await getDocs(ref);
            const allFlats = [];
            for (const item of data.docs) {
                const search = query(refFav, where("userId", "==", userId), where('flatId', '==', item.id));
                const dataFav = await getDocs(search);
                let favorite = false;
                if (dataFav.docs.length > 0) {
                    favorite = dataFav.docs[0].id;
                }
                const flatsWithFav = { ...item.data(), id: item.id, favorite: favorite };
                allFlats.push(flatsWithFav)
            }
            setFlats(allFlats);
            setFilteredFlats(allFlats);
        }

        if (type === 'favorite-flats') {
            const search = query(refFav, where("userId", "==", userId));
            const data = await getDocs(search);
            const allFlats = [];
            for (const item of data.docs) {
                const refFlat = doc(db, "flats", item.data().flatId);
                const dataFlat = await getDoc(refFlat);
                allFlats.push({ ...dataFlat.data(), id: dataFlat.id, favorite: item.id });
            }

            setFlats(allFlats);
            setFilteredFlats(allFlats);
        }
    }

    const addFavorite = async (id) => {
        const data = { userId: userId, flatId: id }
        await addDoc(refFav, data);
        setFlag(!flag);
    }

    const removeFavorite = async (id) => {
        const refRemoveFav = doc(db, "favorites", id)
        await deleteDoc(refRemoveFav);
        setFlag(!flag);
    }

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'flats', id));
            setFlats(flats.filter(flat => flat.id !== id));
            setFilteredFlats(filteredFlats.filter(flat => flat.id !== id));
            console.log('Flat deleted successfully');
        } catch (error) {
            console.error('Error deleting flat: ', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleFilterAndSort = () => {
        const filtered = flats.filter(flat => {
            return (
                flat.city && 
                flat.city.toLowerCase().includes(filters.city.toLowerCase()) &&
                (!filters.minAreaSize || (flat.areaSize && parseInt(flat.areaSize) >= parseInt(filters.minAreaSize))) &&
                (!filters.maxAreaSize || (flat.areaSize && parseInt(flat.areaSize) <= parseInt(filters.maxAreaSize))) &&
                (!filters.minRentPrice || (flat.rentPrice && parseInt(flat.rentPrice) >= parseInt(filters.minRentPrice))) &&
                (!filters.maxRentPrice || (flat.rentPrice && parseInt(flat.rentPrice) <= parseInt(filters.maxRentPrice)))
            );
        }).sort((a, b) => a.city.localeCompare(b.city, undefined, { sensitivity: 'base' }));
        setFilteredFlats(filtered);
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) { 
            setRowsPerPage(value);
            setPage(0);
            const startIndex = page * value;
            const endIndex = Math.min((startIndex + value), filteredFlats.length);
            setFilteredFlats(flats.slice(startIndex, endIndex));
        }
    };

    useEffect(() => {
        getData();
    }, [flag]);

    useEffect(() => {
        handleFilterAndSort();
    }, [filters, flats]);

    const getOwnerData = async (flat) => {
        try {
            const userRef = doc(db, 'users', flat.user);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                flat.ownerName = userData.firstName + ' ' + userData.lastName;
                flat.ownerEmail = userData.email;
            } else {
                console.error('User document does not exist');
            }
        } catch (error) {
            console.error('Error getting owner data:', error);
        }
    };

    useEffect(() => {
        if (type === 'all-flats' || type === 'favorite-flats') {
            filteredFlats.forEach(async (flat) => {
                await getOwnerData(flat);
            });
        }
    }, [filteredFlats]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>
                <TextField
                    name="city"
                    label="City"
                    variant="outlined"
                    size="small"
                    value={filters.city}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="minAreaSize"
                    label="Min Area Size"
                    variant="outlined"
                    size="small"
                    value={filters.minAreaSize}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="maxAreaSize"
                    label="Max Area Size"
                    variant="outlined"
                    size="small"
                    value={filters.maxAreaSize}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="minRentPrice"
                    label="Min Rent Price"
                    variant="outlined"
                    size="small"
                    value={filters.minRentPrice}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="maxRentPrice"
                    label="Max Rent Price"
                    variant="outlined"
                    size="small"
                    value={filters.maxRentPrice}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <Button onClick={handleFilterAndSort} variant="contained" color="primary">
                    Sort Table
                </Button>
            </div>
            <TableContainer>
                <Table className="min-w-full divide-y divide-gray-200" aria-label="simple table">
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</TableCell>
                            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Area size</TableCell>
                            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Rent price</TableCell>
                            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Has AC</TableCell>
                            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Date available</TableCell>
                            {(type === 'all-flats' || type === 'favorite-flats') && <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Owner Name</TableCell>}
                            {(type === 'all-flats' || type === 'favorite-flats') && <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right">Owner Email</TableCell>}
                            {(type === 'all-flats' || type === 'favorite-flats') && <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right"></TableCell>}
                            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="bg-white divide-y divide-gray-200">
                        {(rowsPerPage > 0
                            ? filteredFlats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : filteredFlats
                        ).map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="px-6 py-4 whitespace-nowrap">{row.city}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">{row.areaSize}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">{row.rentPrice}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">{row.hasAc ? 'Yes' : 'No'}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">{row.dateAvailable}</TableCell>
                                {(type === 'all-flats' || type === 'favorite-flats') && <TableCell className="px-6 py-4 whitespace-nowrap">{row.ownerName}</TableCell>}
                                {(type === 'all-flats' || type === 'favorite-flats') && <TableCell className="px-6 py-4 whitespace-nowrap">{row.ownerEmail}</TableCell>}
                                {(type === 'all-flats' || type === 'favorite-flats') && <TableCell className="px-6 py-4 whitespace-nowrap">
                                    {row.favorite ? (
                                        <Button onClick={() => removeFavorite(row.favorite)} startIcon={<Favorite />} color="success">Remove Favorite</Button>
                                    ) : (
                                        <Button onClick={() => addFavorite(row.id)} startIcon={<FavoriteBorder />} color="primary">Add Favorite</Button>
                                    )}
                                </TableCell>}
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <Button href={`/flat/${row.id}`} startIcon={<Visibility />}>View</Button>
                                    {type === 'my-flats' && (
                                        <>
                                            <Button href={`/flat/edit/${row.id}`} startIcon={<Edit />}>Edit</Button>
                                            <Button onClick={() => handleDelete(row.id)} startIcon={<Delete style={{ color: 'red' }} />}>Delete</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredFlats.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={null}
                rowsPerPageOptions={[]} 
            />
        </div>
    );
}
