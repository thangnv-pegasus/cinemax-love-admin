// src/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import type { IcategoryList } from "@/types/category";
import { createCategory, deleteCategory, getCategoriesPagination, updateCategory } from "@/services/category";
import { SmartPagination } from "@/components/common/pagniation-smart";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IcategoryList>();
  const [categories, setCategories] = useState<IcategoryList[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    last_page: 1,
    total: 1
  })

  // hàm handleSubmit có tác dụng call api khi người dùng nhập form thêm mới hoặc sửa thể loại phim
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.name as any).value,
    };

    if (editingCategory) {
      const res = await updateCategory(editingCategory.id, data)

      if (!!res) {
        console.log('>>> res >>> ', res)
        await fetchListCategories(1)
        toast.success('Chỉnh sửa thể loại thành công!')
      } else {
        toast.error('Chỉnh sửa thể loại thất bại!')
      }
    } else {
      const res = await createCategory(data)
      if (!!res) {
        await fetchListCategories(1)
        toast.success('Thêm thể loại phim thành công!')
      } else {
        toast.error('Thêm thể loại phim thất bại!')
      }
    }

    setOpen(false);
    setEditingCategory(undefined);
  };

  // call đến api xóa thể loại, nếu xóa thành công hay thất bại => thông báo ra màn hình
  const handleDelete = async (id: number) => {
    try {
      if (!confirm('Bạn có chắc muốn xóa thể loại này?')) return;
      await deleteCategory(id)
      await fetchListCategories(1)

      toast.success('Xoá thể loại thành công!')
    } catch (err) {
      console.log('delete category err >>> ', err)

      toast.error('Xoá thể loại không thành công!')
    }
  };

  // hàm call api lấy danh sách thể loại phim
  const fetchListCategories = async (page = 1) => {
    const res = await getCategoriesPagination(page, 12)

    setCategories(res?.data || [])
    setMeta(res?.meta || {
      page: 1,
      last_page: 1,
      total: 1
    })
  }

  useEffect(() => {
    fetchListCategories()
  }, [search])

  useEffect(() => {
    if (!open && editingCategory) {
      setEditingCategory(undefined)
    }
  }, [open])

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý thể loại phim</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm thể loại
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Tên thể loại</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                />
              </div>
              <div className="mt-2">
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 hidden">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm thể loại..."
              className="max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thể loại</TableHead>
                <TableHead>Số lượng phim</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat._count.films}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(cat);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    Không có thể loại nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SmartPagination currentPage={meta.page} totalPages={meta.last_page} onPageChange={(page) => fetchListCategories(page)} />
    </div>
  );
}
