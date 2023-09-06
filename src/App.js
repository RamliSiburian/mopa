import React, { useEffect } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Home from './pages';
import UrlNotFound from './components/common/UrlNotFound';
import Dashboard from './pages/dashboard';
import AHP from './pages/ahp';
import Alternatif from './pages/masterData/alternatif';
import Kriteria from './pages/masterData/kriteria';
import Topsis from './pages/topsis';
import MOPA from './pages/mopa';
import Perbandingan from './pages/perbandingan';
import Saw from './pages/saw';
import NilaiPerbandingan from './pages/ahp/nilaiPerbandingan/nilaiPerbandingan';
import NilaiPerbandinganMopa from './pages/mopa/nilaiPerbandingan/nilaiPerbandingan';
import NilaiPerbandinganKriteria from './pages/ahp/nilaiPerbandinganKriteria/nilaiPerbandingan';
import RootLayout from './layout/rootLayout';

const RootRouting = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Kriteria />} />
        <Route path="kriteria" element={<Kriteria />} />
        <Route path="alternatif" element={<Alternatif />} />
        <Route exact path="ahp/nilaiahp" element={<NilaiPerbandingan />} />
        <Route
          exact
          path="ahp/nilaikriteriaahp"
          element={<NilaiPerbandinganKriteria />}
        />
        <Route exact path="ahp/hitung" element={<AHP />} />
        <Route exact path="topsis" element={<Topsis />} />
        <Route exact path="saw" element={<Saw />} />
        <Route
          exact
          path="mopa/nilaimopa"
          element={<NilaiPerbandinganMopa />}
        />
        <Route exact path="mopa/hitung" element={<MOPA />} />
        <Route exact path="perbandingan" element={<Perbandingan />} />
      </Route>
    </Route>
  )
);
function App() {
  return <RouterProvider router={RootRouting} />;
}

export default App;
