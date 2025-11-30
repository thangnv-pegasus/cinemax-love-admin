import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getFilmsHistories } from '@/services/films'
import type { IFilmHistory } from '@/types'
import dayjs from 'dayjs'
import { SmartPagination } from '@/components/common/pagniation-smart'
import { Button } from '@/components/ui/button'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [histories, setHistories] = useState<IFilmHistory[]>([])
  const [meta, setMeta] = useState({
    last_page: 1,
    page: 1,
    total: 1
  })

  // hàm call api lấy danh sách lịch sử xem phim
  const fetchFilmHistories = async (page = 1, limit = 12, search = '') => {
    const res = await getFilmsHistories(page, limit, search)

    setHistories(res?.data || [])
    setMeta(res?.meta || { page: 1, last_page: 1, total: 1 })
  }

  useEffect(() => {
    fetchFilmHistories(1, 12, search)
  }, [search])


  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử xem của người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-x-2 items-center mb-4 hidden">
            <Input
              placeholder="Tìm theo tên user hoặc phim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => fetchFilmHistories(1, 12, search)}>Tìm kiếm</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User name</TableHead>
                <TableHead>Tên phim</TableHead>
                <TableHead>Tập phim</TableHead>
                <TableHead>Thời gian xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {histories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.episode.film.name}</TableCell>
                  <TableCell>{item.episode.name}</TableCell>
                  <TableCell>{dayjs(item.created_at).format('DD/MM/YYYY HH:ss')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {meta.last_page > 1 && <SmartPagination currentPage={meta.page} totalPages={meta.last_page} onPageChange={(page) => fetchFilmHistories(page)} />}
        </CardContent>
      </Card>
    </div>
  )
}
