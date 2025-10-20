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
import { Select as SelectShad, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getCategories } from "@/services/category";
import type { IBaseCategory } from "@/types/category";
import { ScrollArea } from "@/components/ui/scroll-area";
import Select from 'react-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FILM_TYPE } from "@/consts/film";
import type { ICountry } from "@/types";
import { getAllCountries } from "@/services/countries";

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

interface IOptionType {
  label: string;
  value: string;
}

const formInitValues = { name: "", original_name: "", type: '', category_ids: [],country_id: '', thumbnail: undefined, poster: undefined,episodes: undefined, description: "", quality: "", casts: "", director: "" }

export default function FilmPage() {
  const [movies, setMovies] = useState(initialMovies);
  // const [mode, setMode] = useState<'file' | 'text'>('file')
  const [query, setQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(formInitValues);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<IBaseCategory[]>([])
  const [countries, setCountries] = useState<ICountry[]>([])

  const fetchListCategories = async () => {
    const res = await getCategories()
    setCategories(res as IBaseCategory[])
  }

  const fetchListCoutries = async () => {
    const res = await getAllCountries()
    setCountries(res)
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
    const payload = {
      id: editing ? editing.id : Date.now(),
      title: form.name,
      category_ids: form.category_ids,
      poster: form.poster,
    };
    if (editing) {
      // setMovies((prev) => prev.map((m) => (m.id === editing.id ? payload : m)));
    } 
    setIsDialogOpen(false);
  }

  function remove(id: number) {
    if (!confirm("Bạn có chắc muốn xóa phim này?")) return;
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  useEffect(() => {
    if (!isDialogOpen) {
      setEditing(null);
      setForm(formInitValues);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    Promise.all([fetchListCategories(), fetchListCoutries()])
  }, [])

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
          <SelectShad>
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
          </SelectShad>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Plus size={14} /> Thêm phim
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0">
              <DialogHeader className="p-5 border-b-[1px] border-solid border-gray-200">
                <DialogTitle className="text-center">{editing ? "Sửa phim" : "Thêm phim mới"}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] overflow-y-auto p-5">
                <div className="flex flex-col gap-y-5 mt-2">
                  <div>
                    <Label className="mb-2">Tiêu đề</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2">Mô tả phim</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2">Tên gốc</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, original_name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2">Chất lượng</Label>
                    <Input value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2">Kiểu phim</Label>
                    <SelectShad onValueChange={e => setForm({ ...form, type: e })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn kiểu phim" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={String(FILM_TYPE.SERIES)}>Phim bộ</SelectItem>
                          <SelectItem value={String(FILM_TYPE.MOVIE)}>Phim lẻ</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </SelectShad>
                  </div>
                  <div>
                    <Label className="mb-2">Quốc gia</Label>
                    <SelectShad onValueChange={e => setForm({ ...form, country_id: e })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            countries.map((item) => {
                              return <SelectItem value={String(item.id)}>{item.name}</SelectItem>
                            })
                          }

                        </SelectGroup>
                      </SelectContent>
                    </SelectShad>
                  </div>
                  <div>
                    <Label className="mb-2">Diễn viên</Label>
                    <Input value={form.casts} onChange={(e) => setForm({ ...form, casts: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2">Đạo diễn</Label>
                    <Input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2">Thể loại</Label>
                    <Select<IOptionType, true>
                      defaultValue={[]}
                      isMulti
                      name="category_ids"
                      options={(categories ?? []).map(item => ({ label: item.name, value: String(item.id) }))}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                  <Tabs defaultValue="poster-link">
                    <TabsList>
                      <TabsTrigger value="poster-link">Poster url</TabsTrigger>
                      <TabsTrigger value="poster-file">Poster file</TabsTrigger>
                    </TabsList>
                    <TabsContent value="poster-link">
                      <Input type="text" placeholder="Nhập đường dẫn" value={form.poster} />
                    </TabsContent>
                    <TabsContent value="poster-file">
                      <Input type="file" className="cursor-pointer" placeholder="Chọn file poster" value={form.poster} />
                    </TabsContent>
                  </Tabs>
                  <Tabs defaultValue="thumbnail_url">
                    <TabsList>
                      <TabsTrigger value="thumbnail_url">Thumbnail url</TabsTrigger>
                      <TabsTrigger value="thumbnail_file">Thumbnail file</TabsTrigger>
                    </TabsList>
                    <TabsContent value="thumbnail_url">
                      <Input type="text" placeholder="Nhập đường dẫn" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}/>
                    </TabsContent>
                    <TabsContent value="thumbnail_file">
                      <Input type="file" className="cursor-pointer" placeholder="Chọn file thumbnail" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.files})}/>
                    </TabsContent>
                  </Tabs>
                  <div>
                    <Label className="mb-2">Tập phim</Label>
                    <Input value={form.episodes} onChange={(e) => setForm({ ...form, episodes: e.target.value })} multiple/>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                    <Button onClick={save}>{editing ? "Lưu" : "Tạo"}</Button>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phim </CardTitle>
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
                {movies.map((m) => (
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

        </CardContent>
      </Card>
    </div>
  );
}
