import { PostService } from "../../module/post/service/post.service";
import { Test } from "@nestjs/testing";
import { MemberService } from "../../module/member/service/member.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Member } from "../../module/member/entity/member.entity";
import { CreatePostDto } from "../../module/post/dto/create-post.dto";
import { Tag } from "../../module/post/entity/tag.entity";
import { PostHashTag } from "../../module/post/entity/postHashTag.entity";
import { Post } from "../../module/post/entity/post.entity";

describe('Service', () =>{
  let postService : PostService;
  let memberService : MemberService;

  const mockPostRepository = {
    findOneBy : jest.fn(),
    create : jest.fn(),
    save : jest.fn(),
    find : jest.fn(),
    softRemove : jest.fn(),
  }

  const mockMemberRepository = {
    findOneBy : jest.fn(),
    create : jest.fn(),
    save : jest.fn(),
    find : jest.fn(),
    softRemove : jest.fn(),
  }

  const mockTagRepository = {
    findOneBy : jest.fn(),
    create : jest.fn(),
    save : jest.fn(),
    find : jest.fn(),
    softRemove : jest.fn(),
  }

  const mockPostHashTagRepository = {
    findOneBy : jest.fn(),
    create : jest.fn(),
    save : jest.fn(),
    find : jest.fn(),
    softRemove : jest.fn(),
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MemberService,
        PostService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide : getRepositoryToken(Post),
          useValue : mockPostRepository,
        },
        {
          provide : getRepositoryToken(Tag),
          useValue : mockTagRepository,
        },
        {
          provide : getRepositoryToken(PostHashTag),
          useValue : mockPostHashTagRepository,
        },
      ],
    }).compile();
    postService = moduleRef.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const sampleMember = {
    id : 1,
    email : 'test@naver.com',
    password : 'test1234',
  }
  const samplePost : CreatePostDto = {
    title : "테스트",
    problem_number : 1,
    problem_link : "https://www.acmicpc.net/problem/1",
    rate : 1,
    content : '테스트 콘텐츠',
    alarm : new Date(),
    tags : [1,2],
  }

  describe('게시글 작성', () =>{
    it('게시글 작성 성공', async () =>{
      //given
      const member = new Member();
      member.id = sampleMember.id;

      const tag1 = new Tag();
      tag1.id = 1;
      const tag2 = new Tag();
      tag2.id = 2;

      mockMemberRepository.findOneBy.mockResolvedValueOnce(member);
      mockPostRepository.create.mockResolvedValueOnce(samplePost);
      mockPostRepository.save.mockResolvedValueOnce(samplePost);
      mockTagRepository.findOneBy.mockResolvedValueOnce(tag1).mockResolvedValueOnce(tag2);
      mockPostHashTagRepository.save.mockResolvedValueOnce({});

      //when
      const result = await postService.createPost(sampleMember.id, samplePost);

      //then
      expect(mockMemberRepository.findOneBy).toHaveBeenCalledWith({ id: sampleMember.id });
      expect(mockPostRepository.create).toHaveBeenCalledWith(samplePost);
      expect(mockTagRepository.findOneBy).toHaveBeenCalledTimes(samplePost.tags.length);
      expect(mockPostHashTagRepository.save).toHaveBeenCalledTimes(samplePost.tags.length);
      expect(result).toEqual(samplePost);
    })
  })
})