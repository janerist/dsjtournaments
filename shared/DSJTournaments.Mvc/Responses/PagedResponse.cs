namespace DSJTournaments.Mvc.Responses
{
    public class PagedResponse<T>
    {
        public T[] Data { get; set; }
        public int Page { get; set; }
        public int PageSize { get; }
        public int TotalCount { get; set; }

        public PagedResponse(T[] data, int page, int pageSize, int totalCount)
        {
            Data = data;
            Page = page;
            PageSize = pageSize;
            TotalCount = totalCount;
        }
    }
}