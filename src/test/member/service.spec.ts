import { MemberService } from "../../module/member/service/member.service";
import { Test } from "@nestjs/testing";
import { Member } from "../../module/member/entity/member.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AlreadyExistedException } from "../../common/exception";

describe('MemberService', () =>{

  let memberService : MemberService;

  const fixedDate = new Date('2024-01-01T00:00:00Z');

  const mockMember= {
    id: 1,
    email: 'test@naver.com',
    password: 'test1234',
  };

  const mockMembers = [
    {
      id : 1,
      email : "test@naver1.com",
      password : "test1234",
      passwordCheck : "test1234"
    },
    {
      id : 2,
      email : "test@naver2.com",
      password : "test1235",
      passwordCheck : "test1235"
    },
  ]

  const mockRepository = {
    findOneBy : jest.fn().mockImplementation(({id})=>{
      const findMember = mockMembers.find((member)=>
        member.id === id
      );
      if(!findMember){
        throw new BadRequestException("존재하지 않는 회원입니다.");
      }
      return findMember;
    }),
    create : jest.fn(),
    save : jest.fn(),
    find : jest.fn(),
    softRemove : jest.fn(),
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockRepository,
        }
      ],
    }).compile();
    memberService = moduleRef.get<MemberService>(MemberService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('회원가입', () =>{
    it('회원가입 성공', async () =>{
      //given
      const createMemberDto = {
        email : 'test@naver.com',
        password : 'test1234',
        passwordCheck : 'test1234',
      }
      mockRepository.findOneBy.mockResolvedValue(false); // 회원이 존재하지 않는 경우
      mockRepository.create.mockReturnValue({ email: createMemberDto.email, password: createMemberDto.password });
      mockRepository.save.mockResolvedValue({}); // 저장완료
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      //when
      const result = await memberService.signUp(createMemberDto);

      //then
      expect(result.created).toEqual(new Date());
    })

    it('회원가입 실패 - 이미 존재하는 회원', async () =>{
      //given
      const createMemberDto = {
        email : 'test@naver.com',
        password : 'test1234',
        passwordCheck : 'test1234',
      }

      mockRepository.findOneBy.mockResolvedValue(mockMember);
      //jest.spyOn(mockRepository, "findOneBy").mockReturnValue(mockMember);

      //when, then
      await expect(memberService.signUp(createMemberDto)).rejects.toThrow(AlreadyExistedException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@naver.com' });
    });

    it('회원가입 실패 - 비밀번호 불일치', async () =>{
      //given
      const createMemberDto = {
        email : 'test@naver.com',
        password : 'test1234',
        passwordCheck : 'test1235',
      }
      mockRepository.findOneBy.mockResolvedValue(false);

      //when, then
      await expect(memberService.signUp(createMemberDto)).rejects.toThrow(new BadRequestException('패스워드 불일치'));
    })

    describe('회원조회', () => {
      it('성공 - 회원 전체조회', async () => {
        //given
        const mockMember1 = {
          id: 1,
          email: 'test1@naver.com',
          password: 'test1234',
        };
        const mockMember2 = {
          id: 2,
          email: 'test2@naver.com',
          password: 'test1234',
        };
        mockRepository.find.mockReturnValue([mockMember1, mockMember2]);

        //when
        const members: Member[] = await memberService.getAllMember();

        //then
        expect(members.length).toEqual(2);
      })

      it('성공 - 회원 단일조회', async () => {
        //given
        const member = {
          id: 3,
          email: "testEmail@naver.com",
          password: "password",
          passwordCheck: "password",
        }
        mockRepository.findOneBy.mockResolvedValueOnce(member);

        //when
        const findMember: Member = await memberService.getMember(3);

        //then
        expect(findMember).toEqual(member);
      });

      it('실패 - 존재하지 않는 회원 조회', async () => {
        //given
        mockMembers.length = 0;

        //when, then
        await expect(memberService.getMember(1)).rejects.toThrowError(NotFoundException)
      })
    })

    describe('회원삭제', () => {
      it('성공 - 회원삭제', async () => {
        const deletedMember = {
          id: 1,
          email: 'testEmail@naver.com',
          password: 'password'
        }
        //given
        mockRepository.softRemove.mockResolvedValueOnce(deletedMember)

        //when,
        const result = await memberService.removeMember(1);

        // then
        expect(result).toEqual(deletedMember);
      })

      it('실패 - 존재하지 않는 회원', async () => {
        //given
        mockRepository.softRemove.mockImplementation(() => {
          throw new NotFoundException('존재하지 않는 회원입니다.');
        });

        //when, then
        await expect(memberService.removeMember(1)).rejects.toThrowError(NotFoundException);
      })
    });

  });
})