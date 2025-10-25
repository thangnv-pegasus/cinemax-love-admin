'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SelectMulti from 'react-select';
import { FILM_TYPE } from '@/consts/film';
import type { IBaseCategory } from '@/types/category';
import type { ICountry } from '@/types';
import { useFieldArray } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';


// ✅ Schema validate form
const filmSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  original_name: z.string().optional(),
  quality: z.string().optional(),
  type: z.string().min(1, 'Chọn kiểu phim'),
  country_id: z.string().min(1, 'Chọn quốc gia'),
  casts: z.string().optional(),
  director: z.string().optional(),
  category_ids: z.array(z.string()).nonempty('Chọn ít nhất 1 thể loại'),
  poster: z.any().optional(),
  thumbnail: z.any().optional(),
  episodes: z
    .array(
      z.object({
        source_type: z.enum(['url', 'file']),
        source: z.any(),
      }),
    )
    .optional(),
});

type FilmFormValues = z.infer<typeof filmSchema>;
interface IProps {
  categories: IBaseCategory[];
  countries: ICountry[];
  onCreate?: (values: any) => void
  reloadFilms?: () => void
  editingFilm?: any
  onUpdate?: (id: number, payload: any) => void
}

export default function FilmFormDialog({ categories = [], countries = [], onCreate = () => { }, reloadFilms = () => { }, editingFilm, onUpdate = () => { } }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [posterMode, setPosterMode] = useState<'link' | 'file'>('link');
  const [thumbMode, setThumbMode] = useState<'link' | 'file'>('link');
  const form = useForm<FilmFormValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      name: '',
      description: '',
      original_name: '',
      quality: '',
      type: '',
      country_id: '',
      casts: '',
      director: '',
      category_ids: [],
      poster: undefined,
      thumbnail: undefined,
      episodes: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'episodes',
  });

  // ✅ Handle submit
  const onSubmit = async (values: FilmFormValues) => {
    try {
      // Nếu có file trong poster / thumbnail thì dùng FormData
      const isPosterFile = values.poster && typeof values.poster !== 'string' && values.poster instanceof File;
      const isThumbFile = values.thumbnail && typeof values.thumbnail !== 'string' && values.thumbnail instanceof File;

      if (isPosterFile || isThumbFile) {
        const fd = new FormData();
        fd.append('name', values.name);
        fd.append('description', values.description || '');
        fd.append('original_name', values.original_name || '');
        fd.append('quality', values.quality || '');
        fd.append('type', String(values.type || ''));
        fd.append('country_id', String(values.country_id || ''));
        fd.append('casts', values.casts || '');
        fd.append('director', values.director || '');
        // categories as array -> join or append multiple based on backend expectation
        values.category_ids?.forEach((c) => fd.append('category_ids[]', c));

        if (isPosterFile) {
          fd.append('poster', values.poster as File);
        } else if (typeof values.poster === 'string') {
          // keep url if not changed
          fd.append('poster_url', values.poster);
        } else if (editingFilm?.poster_url) {
          fd.append('poster_url', editingFilm.poster_url);
        }

        if (isThumbFile) {
          fd.append('thumbnail', values.thumbnail as File);
        } else if (typeof values.thumbnail === 'string') {
          fd.append('thumb_url', values.thumbnail);
        } else if (editingFilm?.thumb_url) {
          fd.append('thumb_url', editingFilm.thumb_url);
        }

        // episodes: send appropriately
        (values.episodes || []).forEach((ep, idx) => {
          if (ep.source_type === 'file' && ep.source instanceof File) {
            fd.append(`episodes[${idx}][source_file]`, ep.source);
            fd.append(`episodes[${idx}][source_type]`, 'file');
          } else {
            fd.append(`episodes[${idx}][source]`, ep.source || '');
            fd.append(`episodes[${idx}][source_type]`, ep.source_type);
          }
        });

        if (editingFilm) {
          await onUpdate(editingFilm.id, fd);
        } else {
          await onCreate(fd);
        }
      } else {
        // Không có file -> gửi JSON object, giữ url cũ nếu không thay đổi
        const payload: any = {
          name: values.name,
          description: values.description,
          original_name: values.original_name,
          quality: values.quality,
          type: values.type,
          country_id: values.country_id,
          casts: values.casts,
          director: values.director,
          category_ids: values.category_ids || [],
          poster_url: typeof values.poster === 'string' ? values.poster : editingFilm?.poster_url,
          thumb_url: typeof values.thumbnail === 'string' ? values.thumbnail : editingFilm?.thumb_url,
          episodes: (values.episodes || []).map((ep) => ({
            source_type: ep.source_type,
            source: ep.source,
          })),
        };

        if (editingFilm) {
          await onUpdate(editingFilm.id, payload);
        } else {
          await onCreate(payload);
        }
      }

      toast.success('Lưu phim thành công!');
      setIsOpen(false);
      reloadFilms();
    } catch (err) {
      console.error(err);
      toast.error('Lưu phim thất bại!');
    }
  };

  useEffect(() => {
    if (editingFilm) {
      // reset form với dữ liệu từ backend
      form.reset({
        name: editingFilm.name || '',
        description: editingFilm.description || '',
        original_name: editingFilm.original_name || '',
        quality: editingFilm.quality || '',
        type: String(editingFilm.type ?? ''),
        country_id: String(editingFilm.country_film?.[0]?.country?.id ?? ''),
        casts: editingFilm.casts || '',
        director: editingFilm.director || '',
        category_ids: (editingFilm.filmCategories || []).map((c: any) => String(c.category.id)),
        // set poster/thumbnail as URL string so URL input shows it
        poster: editingFilm.poster_url || '',
        thumbnail: editingFilm.thumb_url || '',
        episodes: (editingFilm.episodes || []).map((ep: any) => ({
          source_type: 'url' as const,
          source: ep.url,
        })),
      });

      // preview từ URL cũ
      setPosterPreview(editingFilm.poster_url || null);
      setThumbPreview(editingFilm.thumb_url || null);

      // set tab mode là 'link' nếu có url; nếu backend cung cấp file info and you want to default to file, set accordingly
      setPosterMode(editingFilm.poster_url ? 'link' : 'file');
      setThumbMode(editingFilm.thumb_url ? 'link' : 'file');

      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingFilm]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Plus size={14} /> Thêm phim
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <DialogHeader className="p-5 border-b border-gray-200">
          <DialogTitle className="text-center">Thêm phim mới</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] overflow-y-auto p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl><Input placeholder="Nhập tiêu đề" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả phim</FormLabel>
                    <FormControl><Textarea placeholder="Nhập mô tả" {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="original_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên gốc</FormLabel>
                    <FormControl><Input placeholder="Nhập tên gốc" {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chất lượng</FormLabel>
                    <FormControl><Input placeholder="HD, FullHD..." {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="casts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diễn viên</FormLabel>
                    <FormControl><Input placeholder="Nhập danh sách diễn viên (cách nhau bởi dấu phẩy)" {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đạo diễn</FormLabel>
                    <FormControl><Input placeholder="Nhập đạo diễn" {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kiểu phim</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kiểu phim" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={String(FILM_TYPE.SERIES)}>Phim bộ</SelectItem>
                          <SelectItem value={String(FILM_TYPE.MOVIE)}>Phim lẻ</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc gia</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    <FormControl>
                      <SelectMulti
                        isMulti
                        className="react-select"
                        classNamePrefix="select"
                        options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                        value={categories
                          .filter((c) => field.value.includes(String(c.id)))
                          .map((c) => ({ value: String(c.id), label: c.name }))}
                        onChange={(val) => field.onChange(val.map((v) => v.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Poster</FormLabel>
                <Tabs value={posterMode} onValueChange={(v) => setPosterMode(v as any)}>
                  <TabsList>
                    <TabsTrigger value="link">Poster URL</TabsTrigger>
                    <TabsTrigger value="file">Poster File</TabsTrigger>
                  </TabsList>

                  <TabsContent value="link">
                    <FormField
                      control={form.control}
                      name="poster"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Nhập đường dẫn poster"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {posterPreview && (
                      <div className="mt-2">
                        <img src={posterPreview} alt="poster preview" className="w-40 rounded-md border" />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="file">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          form.setValue('poster', f);
                          setPosterPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                    {posterPreview && (
                      <div className="mt-2">
                        <img src={posterPreview} alt="poster preview" className="w-40 rounded-md border" />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* THUMBNAIL: Tab link / file */}
              <div>
                <FormLabel>Thumbnail</FormLabel>
                <Tabs value={thumbMode} onValueChange={(v) => setThumbMode(v as any)}>
                  <TabsList>
                    <TabsTrigger value="link">Thumbnail URL</TabsTrigger>
                    <TabsTrigger value="file">Thumbnail File</TabsTrigger>
                  </TabsList>

                  <TabsContent value="link">
                    <FormField
                      control={form.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Nhập đường dẫn thumbnail" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {thumbPreview && (
                      <div className="mt-2">
                        <img src={thumbPreview} alt="thumb preview" className="w-32 rounded-md border" />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="file">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          form.setValue('thumbnail', f);
                          setThumbPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                    {thumbPreview && (
                      <div className="mt-2">
                        <img src={thumbPreview} alt="thumb preview" className="w-32 rounded-md border" />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Episodes (giữ logic useFieldArray như bạn có) */}
              <div>
                <div className="flex items-center justify-between">
                  <FormLabel>Tập phim</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ source_type: 'url', source: '' })}
                  >
                    <Plus size={14} /> Thêm tập
                  </Button>
                </div>

                <div className="space-y-4 mt-3">
                  {fields.map((fField, index) => (
                    <div key={fField.id} className="border p-4 rounded-lg relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={16} />
                      </Button>

                      <Tabs
                        value={form.watch(`episodes.${index}.source_type`) as any}
                        onValueChange={(val) => form.setValue(`episodes.${index}.source_type`, val as any)}
                      >
                        <TabsList>
                          <TabsTrigger value="url">URL</TabsTrigger>
                          <TabsTrigger value="file">File</TabsTrigger>
                        </TabsList>

                        <TabsContent value="url">
                          <FormField
                            control={form.control}
                            name={`episodes.${index}.source`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Nhập URL video" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TabsContent>

                        <TabsContent value="file">
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              form.setValue(`episodes.${index}.source`, file);
                            }}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
                <Button type="submit">Tạo</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
