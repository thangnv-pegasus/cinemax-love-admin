import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";
import { Edit, Trash2, Plus, Search, Loader } from "lucide-react";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import type { IUserInfo } from "@/types/user";
import { ROLE_USER } from "@/consts/user";
import { createUser, deleteUser, getUsers, updateUser } from "@/services/users";
import type { IPaginationResponse } from "@/types";
import dayjs from 'dayjs'
import { SmartPagination } from "@/components/common/pagniation-smart";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IUserInfo>();
  const [form, setForm] = useState({ name: "", email: "", role: ""});
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)

  useEffect(() => {
    if (!isDialogOpen) {
      setEditing(undefined);
      setForm({ name: "", email: "", role: ""});
    }
  }, [isDialogOpen]);

  const getListUsers = async () => {
    setIsLoading(true)
    const res: IPaginationResponse<IUserInfo> = await getUsers(page, 12, '')

    setUsers(res.items)
    setTotalPage(Math.ceil(res.total / res.limit) || 1)
    setIsLoading(false)
  }

  function openCreate() {
    setEditing(undefined);
    setForm({ name: "", email: "", role: String(ROLE_USER.user) });
    setIsDialogOpen(true);
  }

  function openEdit(user: IUserInfo) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: String(user.role) });
    setIsDialogOpen(true);
  }

  async function save() {
    if (!form.name || !form.email) return alert("Vui lòng nhập tên và email");
    if(!!editing) {
      try {
        setLoadingBtn(true)
        const res = await updateUser(Number(editing?.id), form)

        if(!!res) {
          toast.success('Sửa người dùng thành công!')
          setIsDialogOpen(false);
          setPage(1)
          await getListUsers();
        }else {
          toast.error('Sửa người dùng thất bại!')
        }
      }catch(err) {
        console.log('>>> update err >>> ', err)

        toast.error('Sửa người dùng thất bại!')
      }finally {
        setLoadingBtn(false)
      }
    }else {
      try {
        const res = await createUser(form)

        console.log(res)
        if(!!res) {
          toast.success('Tạo người dùng mới thành công')
          setIsDialogOpen(false)
        }else {
          toast.error('Tạo người dùng thất bại!')
        }
      }catch(err) {
        console.error('>>> create err >> ', err)
        toast.error('Tạo người dùng thất bại!')
      }
    }
  }

  async function remove(id: number) {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const res = await deleteUser(id)

      if(!!res) {
        toast.success('Xoá người dùng thành công!')
        setPage(1)
        await getListUsers();
      }else {
        toast.error('xoá người dùng thất bại!')
      }
    }catch (err) {
      toast.error('xoá người dùng thất bại!')
    }
  }

  useEffect(() => {
    getListUsers()
  },[page])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-sm text-muted-foreground">Danh sách người dùng, thêm / sửa / xóa, lọc và phân trang.</p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Search size={16} />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
          </div>

          <Select onValueChange={(v) => setRoleFilter(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Lọc theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="#">Tất cả</SelectItem>
              <SelectItem value={String(ROLE_USER.admin)}>Admin</SelectItem>
              <SelectItem value={String(ROLE_USER.user)}>User</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-5 mt-2">
                <div>
                  <Label className="mb-2">Họ tên</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-2">Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-2">Vai trò</Label>
                  <Select value={String(form.role)} onValueChange={(v) => setForm({ ...form, role: String(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(ROLE_USER.admin)}>Admin</SelectItem>
                      <SelectItem value={String(ROLE_USER.user)}>User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                  <Button onClick={save} disabled={loadingBtn}> {loadingBtn && <Loader />} {editing ? "Lưu" : "Tạo"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({users?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              {
                !isLoading && <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <Avatar><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role === ROLE_USER.admin ? 'Admin' : 'User'}</TableCell>
                    <TableCell>{dayjs(u.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(u)} className="flex items-center gap-2"><Edit size={14} /> Sửa</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(u.id)} className="flex items-center gap-2"><Trash2 size={14} /> Xóa</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              }
            </Table>
            {
              isLoading && 
              <div className="flex items-center justify-center h-[80vh] w-full"> 
                <Spinner className="size-20" />
              </div>
            }
          </div>
        </CardContent>
      </Card>
      <SmartPagination 
        currentPage={page} 
        onPageChange={(page) => setPage(page)} 
        totalPages={totalPage} 
        className="mt-5" 
      />
    </div>
  );
}
