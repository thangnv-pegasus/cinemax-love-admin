import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [watchHistory] = useState(() =>
    Array.from({ length: 52 }, (_, i) => ({
      id: i + 1,
      userName: `User ${i % 8 + 1}`,
      movieTitle: `Phim ${i % 12 + 1}`,
      watchedMovie: `Phần ${Math.floor(i / 10) + 1}`,
      episode: `Tập ${i % 5 + 1}`,
      duration: `${30 + (i % 60)} phút`,
      watchedAt: new Date(2025, 9, (i % 28) + 1, 19, 30).toLocaleString('vi-VN'),
    }))
  )

  const filteredHistory = useMemo(() => {
    const keyword = search.toLowerCase()
    return watchHistory.filter(
      (item) =>
        item.userName.toLowerCase().includes(keyword) ||
        item.movieTitle.toLowerCase().includes(keyword)
    )
  }, [search, watchHistory])

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredHistory.slice(start, start + itemsPerPage)
  }, [filteredHistory, currentPage])

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử xem của người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Tìm theo tên user hoặc phim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User name</TableHead>
                <TableHead>Tên phim</TableHead>
                <TableHead>Phim đã xem</TableHead>
                <TableHead>Tập phim</TableHead>
                <TableHead>Thời lượng xem</TableHead>
                <TableHead>Thời gian xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.movieTitle}</TableCell>
                  <TableCell>{item.watchedMovie}</TableCell>
                  <TableCell>{item.episode}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.watchedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
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
        </CardContent>
      </Card>
    </div>
  )
}
