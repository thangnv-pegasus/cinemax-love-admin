import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2, Edit, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getCategories } from "@/services/category";
import type { IBaseCategory } from "@/types/category";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialMovies = [
  { id: 1, title: "The Silent Sea", year: 2021, genres: ["Sci-Fi", "Drama"], rating: 7.9, poster: "https://picsum.photos/seed/1/200/300" },
  { id: 2, title: "Midnight Runner", year: 2019, genres: ["Action", "Thriller"], rating: 6.8, poster: "https://picsum.photos/seed/2/200/300" },
  { id: 3, title: "A Quiet Place", year: 2018, genres: ["Horror", "Drama"], rating: 8.0, poster: "https://picsum.photos/seed/3/200/300" },
  { id: 4, title: "Inception", year: 2010, genres: ["Sci-Fi", "Action"], rating: 8.8, poster: "https://picsum.photos/seed/4/200/300" },
  { id: 5, title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Adventure"], rating: 8.6, poster: "https://picsum.photos/seed/5/200/300" },
  { id: 6, title: "Parasite", year: 2019, genres: ["Thriller", "Drama"], rating: 8.5, poster: "https://picsum.photos/seed/6/200/300" },
  { id: 7, title: "Avatar", year: 2009, genres: ["Fantasy", "Action"], rating: 7.8, poster: "https://picsum.photos/seed/7/200/300" },
  { id: 8, title: "Joker", year: 2019, genres: ["Crime", "Drama"], rating: 8.5, poster: "https://picsum.photos/seed/8/200/300" },
  { id: 9, title: "Tenet", year: 2020, genres: ["Sci-Fi", "Thriller"], rating: 7.3, poster: "https://picsum.photos/seed/9/200/300" },
  { id: 10, title: "1917", year: 2019, genres: ["War", "Drama"], rating: 8.3, poster: "https://picsum.photos/seed/10/200/300" },
];

export default function FilmPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", year: "", genres: "", rating: "", poster: "" });
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [categories, setCategories] = useState<IBaseCategory[]>([])

  const fetchListCategories = async () => {
    const res = await getCategories()
    setCategories(res as IBaseCategory[])
  }

  const filtered = useMemo(() => {
    let res = [...movies];
    if (query) {
      const q = query.toLowerCase();
      res = res.filter((m) => m.title.toLowerCase().includes(q) || String(m.year).includes(q));
    }
    
    if (sortBy === "title") res.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "year") res.sort((a, b) => b.year - a.year);
    if (sortBy === "rating") res.sort((a, b) => b.rating - a.rating);
    return res;
  }, [movies, query, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentMovies = filtered.slice((page - 1) * perPage, page * perPage);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", year: String(new Date().getFullYear()), genres: "", rating: "", poster: "" });
    setIsDialogOpen(true);
  }

  function openEdit(movie: any) {
    setEditing(movie);
    setForm({
      title: movie.title,
      year: movie.year,
      genres: movie.genres.join(", "),
      rating: movie.rating,
      poster: movie.poster,
    });
    setIsDialogOpen(true);
  }

  function save() {
    if (!form.title || !form.year) return alert("Vui lòng nhập tiêu đề và năm");
    const payload = {
      id: editing ? editing.id : Date.now(),
      title: form.title,
      year: Number(form.year),
      genres: form.genres ? form.genres.split(",").map((s) => s.trim()).filter(Boolean) : [],
      rating: Number(form.rating) || 0,
      poster: form.poster || `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/200/300`,
    };
    if (editing) {
      setMovies((prev) => prev.map((m) => (m.id === editing.id ? payload : m)));
    } else {
      setMovies((prev) => [payload, ...prev]);
    }
    setIsDialogOpen(false);
  }

  function remove(id) {
    if (!confirm("Bạn có chắc muốn xóa phim này?")) return;
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered]);

  useEffect(() => {
    if (!isDialogOpen) {
      setEditing(null);
      setForm({ title: "", year: "", genres: "", rating: "", poster: "" });
    }
  }, [isDialogOpen]);

  useEffect(() => {
    fetchListCategories()
  },[])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phim</h1>
          <p className="text-sm text-muted-foreground">Danh sách phim, thêm / sửa / xóa, lọc và phân trang.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Search size={16} />
            <Input placeholder="Tìm theo tiêu đề hoặc năm..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
          </div>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Chọn thể loại phim" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-72 w-full">
                {
                  categories.map((item) => {
                    return <SelectItem value={String(item.id)}>{item.name}</SelectItem>
                  })
                }
              </ScrollArea>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Plus size={14} /> Thêm phim
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Sửa phim" : "Thêm phim mới"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Tiêu đề</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <Label>Năm</Label>
                  <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
                <div>
                  <Label>Thể loại (phân tách bằng dấu phẩy)</Label>
                  <Input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} />
                </div>
                <div>
                  <Label>Đánh giá (0 - 10)</Label>
                  <Input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div>
                  <Label>URL poster (tùy chọn)</Label>
                  <Input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                  <Button onClick={save}>{editing ? "Lưu" : "Tạo"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phim ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poster</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Năm</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMovies.map((m) => (
                  <TableRow key={m.id} className="align-top">
                    <TableCell><Avatar><img src={m.poster} alt={m.title} className="object-cover w-16 h-24 rounded" /></Avatar></TableCell>
                    <TableCell className="font-medium">{m.title}</TableCell>
                    <TableCell>{m.year}</TableCell>
                    <TableCell><div className="flex flex-wrap gap-2">{m.genres.map((g) => (<span key={g} className="px-2 py-1 text-xs rounded-md border">{g}</span>))}</div></TableCell>
                    <TableCell>{m.rating}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(m)} className="flex items-center gap-2"><Edit size={14} /> Sửa</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(m.id)} className="flex items-center gap-2"><Trash2 size={14} /> Xóa</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">Không tìm thấy phim nào.</p>}

          {filtered.length > 0 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
