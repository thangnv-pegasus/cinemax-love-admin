import { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash2 } from 'lucide-react';
import { getCategories } from '@/services/category';
import { getAllCountries } from '@/services/countries';
import { deleteFilm, getFilmPagination, postNewFilm, updateFilm } from '@/services/films';
import type { IBaseCategory } from '@/types/category';
import type { ICountry } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import FilmFormDialog from '@/components/form/film-dialog';
import { SmartPagination } from '@/components/common/pagniation-smart';
import { toast } from 'sonner';

export default function FilmPage() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<IBaseCategory[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [films, setFilms] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 1, page: 1, last_page: 1 });
  const [editingFilm, setEditingFilm] = useState<any | null>(null);

  const fetchListCategories = async () => {
    const res = await getCategories();
    setCategories(res as IBaseCategory[]);
  };

  const fetchListCountries = async () => {
    const res = await getAllCountries();
    setCountries(res);
  };

  const fetchListFilms = async (page = 1) => {
    const res = await getFilmPagination(page);
    setFilms(res?.data || []);
    setMeta(res?.meta || { total: 1, page: 1, last_page: 1 });
  };


  function handleEdit(film: any) {
    setEditingFilm(film);
  }

  const onUpdate = async (id: number, values: any) => {
    try {
      const res = await updateFilm(id, values)

      console.log(res)
    }catch(err) {
      toast.error('Sửa phim không thành công!')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bạn có chắc muốn xóa phim này?')) return;
    // TODO: gọi API xóa phim
    try {
      const res = await deleteFilm(id)

      console.log('>>> res >>> ', res)
      await fetchListFilms(1)
      toast.success('Xoá phim thành công!')
    } catch (err) {
      toast.error('Xoá không thành công!')
    }
  }

  const createFilm = async (payload: any) => {
    const res = await postNewFilm(payload)

    console.log(">>> res >>>>", res)
  }

  useEffect(() => {
    Promise.all([fetchListCategories(), fetchListCountries(), fetchListFilms()]);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phim</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách phim, thêm / sửa / xóa, lọc và phân trang.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Search size={16} />
            <Input
              placeholder="Tìm theo tiêu đề hoặc năm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
          </div>

          {/* 👉 Dialog Thêm/Sửa phim */}
          <FilmFormDialog
            categories={categories}
            countries={countries}
            editingFilm={editingFilm}
            onCreate={createFilm}
            reloadFilms={() => fetchListFilms(1)}
            onUpdate={onUpdate}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <FilmTable
              films={films}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <SmartPagination currentPage={meta.page} totalPages={meta.last_page} onPageChange={(page) => fetchListFilms(page)} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ==============================
   🎬 BẢNG HIỂN THỊ DANH SÁCH PHIM
================================= */
function FilmTable({
  films,
  onEdit,
  onDelete,
}: {
  films: any[];
  onEdit: (film: any) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Poster</TableHead>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Thể loại</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {films.map((m) => (
          <TableRow key={m.id} className="align-top">
            <TableCell>
              <Avatar>
                <img
                  src={m.poster_url}
                  alt={m.name}
                  className="object-cover w-16 h-24 rounded"
                />
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{m.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {m.filmCategories?.map((g: any) => (
                  <span
                    key={`${g.id}-category-film`}
                    className="px-2 py-1 text-xs rounded-md border"
                  >
                    {g.category.name}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(m)}
                  className="flex items-center gap-2"
                >
                  <Edit size={14} /> Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(m.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={14} /> Xóa
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
