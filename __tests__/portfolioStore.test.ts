import { usePortfolioStore } from '@/shared/store/portfolioStore';

describe('portfolioStore', () => {
  it('should have initial state', () => {
    const state = usePortfolioStore.getState();
    expect(state.dynamicProjects).toBeDefined();
    expect(state.dynamicHeroConfig).toBeDefined();
    expect(state.isLoading).toBeDefined();
    expect(state.initializeData).toBeInstanceOf(Function);
  });

  it('should update modal open state', () => {
    const { setShowInquiryModal, setShowCoverLetterModal, setIsChatOpen } = usePortfolioStore.getState();
    
    setShowInquiryModal(true);
    expect(usePortfolioStore.getState().showInquiryModal).toBe(true);

    setShowCoverLetterModal(true);
    expect(usePortfolioStore.getState().showCoverLetterModal).toBe(true);
    
    setIsChatOpen(true);
    expect(usePortfolioStore.getState().isChatOpen).toBe(true);
  });

  it('should select project', () => {
    const { setSelectedProject } = usePortfolioStore.getState();
    const mockProject = { id: '1', title: 'Test Project' } as any;
    
    setSelectedProject(mockProject);
    expect(usePortfolioStore.getState().selectedProject).toEqual(mockProject);
  });
  
  it('should set cover letter text and status', () => {
    const { setCoverLetterText, setCoverLetterStatus, setCoverLetterError } = usePortfolioStore.getState();
    
    setCoverLetterText('test');
    expect(usePortfolioStore.getState().coverLetterText).toBe('test');
    
    setCoverLetterStatus('done');
    expect(usePortfolioStore.getState().coverLetterStatus).toBe('done');
    
    setCoverLetterError('err');
    expect(usePortfolioStore.getState().coverLetterError).toBe('err');
  });

  it('should set selected category', () => {
    const { setSelectedCategory } = usePortfolioStore.getState();
    
    setSelectedCategory('Web');
    expect(usePortfolioStore.getState().selectedCategory).toBe('Web');
  });
});
