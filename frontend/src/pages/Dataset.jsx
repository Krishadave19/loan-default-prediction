import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchBar from '../components/dataset/SearchBar';
import FilterBar from '../components/dataset/FilterBar';
import DatasetStats from '../components/dataset/DatasetStats';
import DatasetTable from '../components/dataset/DatasetTable';
import ErrorMessage from '../components/common/ErrorMessage';
import { SkeletonBlock } from '../components/common/Loading';
import { useFetch } from '../hooks/useFetch';
import { fetchDatasetRows, fetchDatasetStats } from '../services/datasetService';

export default function Dataset() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const {
    data: rows,
    isLoading: rowsLoading,
    error: rowsError,
    refetch,
  } = useFetch(() => fetchDatasetRows({ search, filter }), [search, filter]);

  const { data: stats, isLoading: statsLoading } = useFetch(() => fetchDatasetStats(), []);

  return (
    <DashboardLayout
      badge="Training Corpus Explorer"
      title="Training dataset"
      subtitle="A sample of the loan records used to train and validate the default model."
    >
      <DatasetStats stats={stats} isLoading={statsLoading} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      <div className="mt-6">
        {rowsLoading && <SkeletonBlock className="h-96" />}
        {!rowsLoading && rowsError && <ErrorMessage message={rowsError} onRetry={refetch} />}
        {!rowsLoading && !rowsError && <DatasetTable rows={rows || []} />}
      </div>
    </DashboardLayout>
  );
}
