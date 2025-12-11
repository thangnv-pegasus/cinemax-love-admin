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
  Avatar, AvatarFallback,
} from "@/components/ui/avatar";
import { Edit, Trash2, Search, ArrowRightLeft } from "lucide-react";
import { ROLE_USER } from "@/consts/user";
import { deleteUser, getUsers } from "@/services/users";
import type { IPaginationResponse } from "@/types";
import dayjs from 'dayjs'
import { SmartPagination } from "@/components/common/pagniation-smart";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { IComment } from "@/types/comment";
import { deleteComment, getComments, updateComment } from "@/services/comment";

export default function CommentsPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [query, setQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IComment>();
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)

  useEffect(() => {
    if (!isDialogOpen) {
      setEditing(undefined);
      setForm({ name: "", email: "", role: "" });
    }
  }, [isDialogOpen]);

  // hàm call api lấy danh sách users
  const getDataComments = async (search = '') => {
    setIsLoading(true)
    const res: IPaginationResponse<IComment> = await getComments(page, 12, search)
    setComments(res.items)
    setTotalPage(Math.ceil(res.total / res.limit) || 1)
    setIsLoading(false)
  }

  // hàm call api xóa user
  async function remove(id: number) {
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    try {
      const res = await deleteComment(id)

      if (!!res) {
        toast.success('Xoá bình luận thành công!')
        setPage(1)
        await getDataComments();
      } else {
        toast.error('xoá bình luận thất bại!')
      }
    } catch (err) {
      toast.error('xoá bình luận thất bại!')
    }
  }

  async function changeCommentStatus(id: number, status: number) {
    setLoadingBtn(true)
    try {
      const res = await updateComment(id, { status })
      if (!!res) {
        toast.success('Cập nhật trạng thái bình luận thành công!')
        await getDataComments();
      } else {
        toast.error('Cập nhật trạng thái bình luận thất bại!')
      }
    } catch (err) {
      toast.error('Cập nhật trạng thái bình luận thất bại!')
    }
    setLoadingBtn(false)
  }

  useEffect(() => {
    getDataComments(query)
  }, [page, query])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bình luận</h1>
          <p className="text-sm text-muted-foreground">Danh sách bình luận, sửa / xóa, lọc và phân trang.</p>
        </div>

        <div className="flex gap-3">
          <div className="hidden items-center gap-2">
            <Search size={16} />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bình luận ({comments?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Tên người dùng</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày Gửi</TableHead>
                  <TableHead>Phim</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              {
                !isLoading && <TableBody>
                  {comments?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <Avatar><AvatarFallback>{u.id}</AvatarFallback></Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{u.user.name}</TableCell>
                      <TableCell>{u.content}</TableCell>
                      <TableCell>{dayjs(u.createdAt).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                      <TableCell>{u.episode.film.name} - {u.episode.name}</TableCell>
                      <TableCell>{u.status === 0 ? 'Công khai' : 'Ẩn'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={async () => await changeCommentStatus(u.id, u.status === 0 ? 1 : 0)} className="flex items-center gap-2">
                            <ArrowRightLeft size={14} />
                            {u.status === 0 ? 'Ẩn' : 'Hiện'}
                          </Button>
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
