import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddNilaiPerbandingan from './add';
import { AddIcon, DeleteIcon, EditIcon } from '../../../assets/icons';
import {
  deleteDataPerbandinganAhp,
  getDataPerbandinganAhp,
} from '../../../config/perbandinganAhp';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPerbandinganAhp,
  getAllPerbandinganAhp,
} from '../../../store/perbandinganAhp/perbandinganAhp';
import UpdatePerbandinganAhp from './Update';
import { loadDataPerbandinganAhp } from '../../../store/perbandinganAhp/updatePerbandinganAhp';
import CustomDialogDelete from '../../../components/common/CustomDialogDelete';

const NilaiPerbandingan = () => {
  const dispatch = useDispatch();
  const [openAddNilaiAhp, setOpenAddNilaiAhp] = useState(false);
  const [openUpdatePerbandinganAhp, setOpenUpdatePerbandinganAhp] =
    useState(false);
  const { dataPerbandingan, isLoading } = useSelector(getAllPerbandinganAhp);
  const [codeToDelete, setCodeToDelete] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchPerbandinganAhp());
  }, [openAddNilaiAhp, openUpdatePerbandinganAhp, confirmDelete]);

  const handleUpdate = (item) => {
    dispatch(
      loadDataPerbandinganAhp({
        deskripsi: item.deskripsi,
        nilai: item.nilai,
        kode: item.kode,
      })
    );
    setOpenUpdatePerbandinganAhp(true);
  };

  const deleteData = async () => {
    try {
      await deleteDataPerbandinganAhp(codeToDelete);
      setConfirmDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '16px', color: '#9E9D9D' }}>
            Comparison Value /
          </Typography>

          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            List of Data
          </Typography>
        </Box>
        <Box
          variant="contained"
          sx={{
            background: '#303030',
            width: '75px',
            padding: '6px 8px',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            setOpenAddNilaiAhp(!openAddNilaiAhp);
          }}
        >
          <AddIcon sx={{ color: '#FFF' }} />
          <Typography sx={{ color: '#FFF' }}>Add</Typography>
        </Box>
      </Box>

      <TableContainer sx={{ mt: 3 }}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#FAFAFA' }}>
              <TableCell align="left">No</TableCell>
              <TableCell align="left">Priority</TableCell>
              <TableCell align="left">Value</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPerbandingan?.map((item, idx) => (
              <TableRow key={item?.kode} sx={{}}>
                <TableCell align="left">{idx + 1}</TableCell>
                <TableCell align="left">{item.deskripsi}</TableCell>
                <TableCell align="left">{item.nilai}</TableCell>
                <TableCell align="center">
                  <EditIcon
                    sx={{ color: '#F79327', cursor: 'pointer' }}
                    onClick={() => handleUpdate(item)}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <DeleteIcon
                    sx={{ color: '#B31312', cursor: 'pointer' }}
                    onClick={() => {
                      setCodeToDelete(item?.kode);
                      setConfirmDelete(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isLoading ? (
        <Box
          sx={{
            textAlign: 'center',
            padding: '32px 0px',
            background: 'rgba(81, 177, 92, .05)',
          }}
        >
          <CircularProgress sx={{ color: '#51B15C' }} size={24} />
        </Box>
      ) : (
        dataPerbandingan.length === 0 && (
          <Box
            sx={{
              padding: '32px 0px',
              textAlign: 'center',
              background: 'rgba(243, 58, 58, .05)',
            }}
          >
            <Typography sx={{ fontSize: '14px', color: '#F33A3A' }}>
              Nao data found
            </Typography>
          </Box>
        )
      )}

      {/* dialog delete */}

      {/* <CustomDialogDelete
        open={confirmDelete}
        setOpen={setConfirmDelete}
        handleDelete={handleDelete}
        errorMessage={errorMessageDelete}
      /> */}

      <AddNilaiPerbandingan {...{ openAddNilaiAhp, setOpenAddNilaiAhp }} />
      <UpdatePerbandinganAhp
        {...{ openUpdatePerbandinganAhp, setOpenUpdatePerbandinganAhp }}
      />

      {/* dialog delete */}
      <CustomDialogDelete
        open={confirmDelete}
        setOpen={setConfirmDelete}
        handleDelete={deleteData}
        dataToDelete={codeToDelete}
      />
    </Box>
  );
};

export default NilaiPerbandingan;
